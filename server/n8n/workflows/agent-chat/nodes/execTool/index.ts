import {
  AgentFactoryConfig,
  NodeType,
} from 'server/n8n/workflows/agent-factory/interfaces'
import { getCreateConceptTool } from './tools/KB/KBConcept/createConcept'
import { getReadConceptsTool } from './tools/KB/KBConcept/readConcepts'
import { getUpdateConceptTool } from './tools/KB/KBConcept/updateConcept'
import { getDeleteConceptTool } from './tools/KB/KBConcept/deleteConcept'
import { getFetchRequestTool } from './tools/fetchRequest'
import { getWebSearchAgentTool } from './tools/webSearchAgent'
import { getUrlReaderTool } from './tools/urlReader'
import { getGraphqlRequestTool } from './tools/graphqlRequest'
import { getShellExecuteTool } from './tools/shellExecute'
import { getUpdateProfileTool } from './tools/updateProfile'

export function getExecTools(config: AgentFactoryConfig): NodeType[] {
  const { hasKBTools = true, hasUpdateOwnProfileTool = true } = config

  const tools: Array<NodeType | null | undefined> = [
    getFetchRequestTool(config),
    getWebSearchAgentTool(config),
    getUrlReaderTool(config),
    getGraphqlRequestTool(config),
    getShellExecuteTool(config),

    ...((hasKBTools && [
      getCreateConceptTool(config),
      getReadConceptsTool(config),
      getUpdateConceptTool(config),
      getDeleteConceptTool(config),
    ]) ||
      []),

    ...((hasUpdateOwnProfileTool && [getUpdateProfileTool(config)]) || []),
  ]

  return tools.filter((n) => !!n)
}
