/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'
import { n8nConfig } from '../config'
import { n8nApiRequest } from './n8nApiRequest'
import { internalApiRequest } from './internalApiRequest'
import { CredentialsMap } from '../workflows/interfaces'
import {
  SigninDocument,
  SigninMutation,
  SigninMutationVariables,
  SignupDocument,
  SignupMutation,
  SignupMutationVariables,
} from 'src/gql/generated'
import { AgentCredentials } from './interfaces'

const CREDENTIALS_DIR = n8nConfig.credentialsDir

export async function authenticateAgent(
  agentData: AgentCredentials,
): Promise<string> {
  console.log(`[bootstrap] Authenticating agent: ${agentData.username}`)

  try {
    const signinResult = await internalApiRequest<
      SigninMutation,
      SigninMutationVariables
    >(SigninDocument, {
      data: {
        password: agentData.password,
      },
      where: {
        username: agentData.username,
      },
    })

    if (
      signinResult.data?.response?.success &&
      signinResult.data.response.token
    ) {
      console.log(
        `[bootstrap] Agent ${agentData.username} authenticated successfully`,
      )
      return signinResult.data.response.token
    }

    console.log(
      `[bootstrap] Agent ${agentData.username} not found, attempting registration...`,
    )

    const signupResult = await internalApiRequest<
      SignupMutation,
      SignupMutationVariables
    >(SignupDocument, {
      data: {
        username: agentData.username,
        email: agentData.email,
        password: agentData.password,
        fullname: agentData.fullname,
      },
    })

    if (
      signupResult.data?.response?.success &&
      signupResult.data.response.token
    ) {
      console.log(
        `[bootstrap] Agent ${agentData.username} registered successfully`,
      )
      return signupResult.data.response.token
    }

    const errorMsg =
      signupResult.data?.response?.message ||
      signupResult.errors?.[0]?.message ||
      'Unknown error'
    throw new Error(
      `Failed to authenticate or register agent ${agentData.username}: ${errorMsg}`,
    )
  } catch (err) {
    console.error(
      `[bootstrap] Critical error authenticating agent ${agentData.username}:`,
      err,
    )
    throw err
  }
}

export async function importAgentCredentials(
  cookies: string,
): Promise<CredentialsMap> {
  const credentialsMap: CredentialsMap = {}
  const agentsDir = path.join(CREDENTIALS_DIR, 'agents')
  if (!fs.existsSync(agentsDir)) {
    return credentialsMap
  }

  const agentFiles = fs
    .readdirSync(agentsDir)
    .filter((f) => f.endsWith('.json'))

  if (agentFiles.length === 0) {
    return credentialsMap
  }

  console.log('[bootstrap] Importing agent credentials...')

  for (const file of agentFiles) {
    const filePath = path.join(agentsDir, file)
    const agentName = path.basename(file, '.json')

    try {
      const agentData = JSON.parse(
        fs.readFileSync(filePath, 'utf-8'),
      ) as AgentCredentials

      if (!agentData.agentName) {
        throw new Error(
          `[bootstrap] Agent credentials file ${file} is missing required field 'agentName'`,
        )
      }

      if (!agentData.username || !agentData.password) {
        throw new Error(
          `[bootstrap] Agent credentials file ${file} is missing required field 'username' or 'password'`,
        )
      }

      const token = await authenticateAgent(agentData)

      const credential = {
        id: `internal-${agentName}-cred`,
        name: `Internal API - ${agentName}`,
        type: 'httpHeaderAuth',
        data: {
          name: 'Authorization',
          value: `Bearer ${token}`,
        },
        nodesAccess: [
          {
            nodeType: '@n8n/n8n-nodes-langchain.agent',
            date: new Date().toISOString(),
          },
        ],
      }

      await n8nApiRequest('POST', '/rest/credentials', credential, cookies)
      console.log(`[bootstrap] Imported credentials for agent: ${agentName}`)

      credentialsMap[`agents/${agentName}`] = {
        ...agentData,
        id: credential.id,
        type: credential.type,
        name: credential.name,
      }

      if (agentData.smtp) {
        const smtpCredential = {
          id: agentData.smtp.credentialId,
          name: agentData.smtp.credentialName,
          type: 'smtp',
          data: {
            user: agentData.smtp.user,
            password: agentData.smtp.password,
            host: agentData.smtp.host,
            port: agentData.smtp.port,
            secure: agentData.smtp.ssl ?? false,
            disableStartTls: agentData.smtp.disableStartTls ?? false,
          },
          nodesAccess: [
            {
              nodeType: 'n8n-nodes-base.emailSend',
              date: new Date().toISOString(),
            },
          ],
        }

        await n8nApiRequest(
          'POST',
          '/rest/credentials',
          smtpCredential,
          cookies,
        )
        console.log(
          `[bootstrap] Imported SMTP credentials for agent: ${agentName}`,
        )
      }

      if (agentData.imap) {
        const imapCredential = {
          id: agentData.imap.credentialId,
          name: agentData.imap.credentialName,
          type: 'imap',
          data: {
            user: agentData.imap.user,
            password: agentData.imap.password,
            host: agentData.imap.host,
            port: agentData.imap.port,
            secure: agentData.imap.secure ?? true,
          },
          nodesAccess: [
            {
              nodeType: 'n8n-nodes-base.emailReadImap',
              date: new Date().toISOString(),
            },
          ],
        }

        await n8nApiRequest(
          'POST',
          '/rest/credentials',
          imapCredential,
          cookies,
        )
        console.log(
          `[bootstrap] Imported IMAP credentials for agent: ${agentName}`,
        )
      }
    } catch (err) {
      console.error(
        `[bootstrap] Failed to import agent credentials for ${file}:`,
        err,
      )
      throw err
    }
  }

  return credentialsMap
}
