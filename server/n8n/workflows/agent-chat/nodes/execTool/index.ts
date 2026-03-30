import { NodeType } from 'server/n8n/workflows/agent-factory/interfaces'
import { GetExecToolConfig } from './interfaces'
import { getCreateConceptTool } from './tools/KB/KBConcept/createConcept'
import { getReadConceptsTool } from './tools/KB/KBConcept/readConcepts'
import { getUpdateConceptTool } from './tools/KB/KBConcept/updateConcept'
import { getDeleteConceptTool } from './tools/KB/KBConcept/deleteConcept'
import { getFetchRequestTool } from './tools/fetchRequest'
import { getWebSearchAgentTool } from './tools/webSearchAgent'
import { getUrlReaderTool } from './tools/urlReader'
import { getGraphqlRequestTool } from './tools/graphqlRequest'

export function getExecTools(config: GetExecToolConfig): NodeType[] {
  return [
    getCreateConceptTool(config),
    getReadConceptsTool(config),
    getUpdateConceptTool(config),
    getDeleteConceptTool(config),
    getFetchRequestTool(config),
    getWebSearchAgentTool(config),
    getUrlReaderTool(config),
    getGraphqlRequestTool(config),
  ].filter((n) => !!n)
}
