import { WorkflowRegistry } from '../WorkflowRegistry'
import { CredentialsMap, WorkflowBase } from '../workflows/interfaces'

export type NodeType = WorkflowBase['nodes'][number]

export type WorkflowFactoryProps = {
  credentialsMap: CredentialsMap
  registry: WorkflowRegistry
}
