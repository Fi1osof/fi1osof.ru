/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { n8nApiRequest } from './n8nApiRequest'
import { type CredentialsMap, type WorkflowBase } from '../workflows/interfaces'
import { isWorkflowFactoryClass } from '../WorkflowFactory/helpers/isWorkflowFactoryClass'
import { WorkflowRegistry } from '../WorkflowRegistry'
import { WorkflowFactory } from '../WorkflowFactory'

const WORKFLOWS_DIR = path.join(__dirname, '../workflows')

interface WorkflowData {
  id: string
  versionId: string
  name: string
  active: boolean
  nodes?: WorkflowNode[]
}

interface WorkflowNode {
  parameters?: {
    workflowId?: {
      __rl?: boolean
      mode?: string
      value?: string
    }
    [key: string]: unknown
  }
  [key: string]: unknown
}

async function resolveWorkflowDependencies(
  idMap: Record<string, string>,
  cookies: string,
): Promise<void> {
  console.log('[bootstrap] Resolving workflow dependencies...')

  const unresolvedRefs: { workflow: string; node: string; ref: string }[] = []

  for (const [name, id] of Object.entries(idMap)) {
    const { data } = await n8nApiRequest(
      'GET',
      `/rest/workflows/${id}`,
      undefined,
      cookies,
    )
    const wf = (data as { data?: WorkflowData })?.data
    if (!wf || !wf.nodes) {
      continue
    }

    let hasChanges = false
    const resolvedNodes = wf.nodes.map((node) => {
      const workflowId = node.parameters?.workflowId
      if (
        workflowId?.__rl === true &&
        (workflowId.mode === 'list' || workflowId.mode === 'name') &&
        workflowId.value
      ) {
        const resolvedId = idMap[workflowId.value]
        hasChanges = true

        if (!resolvedId) {
          unresolvedRefs.push({
            workflow: name,
            node: (node as { name?: string }).name || 'unknown',
            ref: workflowId.value,
          })
          return {
            ...node,
            parameters: {
              ...node.parameters,
              workflowId: {
                ...workflowId,
                mode: 'id',
                value: '',
              },
            },
          }
        }

        return {
          ...node,
          parameters: {
            ...node.parameters,
            workflowId: {
              ...workflowId,
              mode: 'id',
              value: resolvedId,
            },
          },
        }
      }
      return node
    })

    if (hasChanges) {
      console.log(`[bootstrap] Resolving '${name}' tool references...`)
      const resolved = { ...wf, nodes: resolvedNodes }
      const { data: patchData } = await n8nApiRequest(
        'PATCH',
        `/rest/workflows/${id}`,
        resolved,
        cookies,
      )
      const patchResult = patchData as { data?: { id?: string }; id?: string }
      if (patchResult?.data?.id || patchResult?.id) {
        console.log(`[bootstrap] '${name}' dependencies resolved`)
      } else {
        console.log(`[bootstrap] '${name}' patch response:`, patchData)
      }
    }
  }

  if (unresolvedRefs.length > 0) {
    const details = unresolvedRefs
      .map((r) => `  - Workflow "${r.workflow}", node "${r.node}": "${r.ref}"`)
      .join('\n')
    throw new Error(
      `[bootstrap] Unresolved workflow references (workflows not found):\n${details}`,
    )
  }
}

async function activateWorkflow(
  wfId: string,
  wfName: string,
  cookies: string,
): Promise<void> {
  const { data } = await n8nApiRequest(
    'GET',
    `/rest/workflows/${wfId}`,
    undefined,
    cookies,
  )
  const wf = (data as { data?: WorkflowData })?.data
  if (!wf) {
    console.error(
      `[bootstrap] Failed to get workflow '${wfName}' for activation`,
    )
    return
  }

  const { data: activateData } = await n8nApiRequest(
    'POST',
    `/rest/workflows/${wfId}/activate`,
    { versionId: wf.versionId, name: wf.name },
    cookies,
  )

  const activated = activateData as {
    data?: { active?: boolean }
    active?: boolean
  }
  if (activated?.data?.active || activated?.active) {
    console.log(`[bootstrap] Workflow '${wfName}' activated`)
  } else {
    console.log(
      `[bootstrap] Workflow '${wfName}' activation response:`,
      activateData,
    )
  }
}

/**
 * Collect all workflow factories/definitions from workflows directory
 */
async function collectWorkflows(registry: WorkflowRegistry): Promise<void> {
  if (!fs.existsSync(WORKFLOWS_DIR)) {
    return
  }

  const entries = fs.readdirSync(WORKFLOWS_DIR)

  for (const entry of entries) {
    const fullPath = path.join(WORKFLOWS_DIR, entry)
    const stat = fs.statSync(fullPath)

    // JSON files
    if (stat.isFile() && entry.endsWith('.json')) {
      const workflow = JSON.parse(
        fs.readFileSync(fullPath, 'utf-8'),
      ) as WorkflowBase
      if (workflow.name) {
        registry.addFlow(workflow.name, workflow)
      }
      continue
    }

    // Directories with index.ts/js
    if (stat.isDirectory()) {
      const indexTs = path.join(fullPath, 'index.ts')
      const indexJs = path.join(fullPath, 'index.js')

      if (fs.existsSync(indexTs) || fs.existsSync(indexJs)) {
        const module = await import(fullPath)
        const exported = module.default || module

        if (isWorkflowFactoryClass(exported)) {
          const factory = new exported({
            credentialsMap: registry.getCredentialsMap(),
            registry,
          }) as WorkflowFactory

          // Register factory with entry name as initial key
          // Factory will register itself with proper name during build
          registry.addFlow(entry, factory)
        } else if (Array.isArray(exported)) {
          for (const wf of exported.filter(Boolean) as WorkflowBase[]) {
            if (wf.name) {
              registry.addFlow(wf.name, wf)
            }
          }
        } else if (exported && typeof exported === 'object' && exported.name) {
          registry.addFlow(exported.name, exported as WorkflowBase)
        }
      }
    }
  }
}

/**
 * New registry-based workflow import.
 * 1. Collect all workflows into registry
 * 2. Build all workflows (resolves nested dependencies)
 * 3. POST all workflows to n8n
 * 4. Resolve workflowId references
 * 5. Activate workflows
 */
export async function importWorkflowsWithRegistry(
  cookies: string,
  credentialsMap: CredentialsMap = {},
): Promise<void> {
  console.log('[bootstrap] Importing workflows (registry mode)...')

  // Step 1: Create registry and collect all workflows
  const registry = new WorkflowRegistry(credentialsMap)
  await collectWorkflows(registry)

  // Step 2: Build all workflows
  console.log('[bootstrap] Building workflows...')
  await registry.buildAll()

  // Step 3: POST all built workflows to n8n
  const workflows = registry.getAllBuilt()
  if (workflows.length === 0) {
    console.log('[bootstrap] No workflows to import')
    return
  }

  console.log(`[bootstrap] Importing ${workflows.length} workflows...`)

  const idMap: Record<string, string> = {}
  const toActivate: { id: string; name: string }[] = []

  for (const workflow of workflows) {
    console.log(`[bootstrap] Importing workflow: ${workflow.name}`)

    const { data } = await n8nApiRequest(
      'POST',
      '/rest/workflows',
      workflow,
      cookies,
    )
    const result = data as { data?: { id?: string }; id?: string }
    const id = result?.data?.id || result?.id

    if (id && workflow.name) {
      console.log(`[bootstrap] Workflow imported: ${workflow.name} (id: ${id})`)
      idMap[workflow.name] = id
      if (workflow.active) {
        toActivate.push({ id, name: workflow.name })
      }
    } else {
      console.error(
        `[bootstrap] Failed to import workflow ${workflow.name}:`,
        data,
      )
    }
  }

  // Step 4: Resolve workflow dependencies
  if (Object.keys(idMap).length > 0) {
    await resolveWorkflowDependencies(idMap, cookies)
  }

  // Step 5: Activate workflows
  if (toActivate.length > 0) {
    console.log('[bootstrap] Activating workflows...')
    for (const { id, name } of toActivate) {
      try {
        await activateWorkflow(id, name, cookies)
      } catch (err) {
        console.error(`[bootstrap] Failed to activate workflow '${name}':`, err)
      }
    }
  }

  console.log('[bootstrap] Registry import completed')
}
