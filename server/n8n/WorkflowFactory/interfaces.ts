import { WorkflowRegistry } from '../WorkflowRegistry'
import { CredentialsMap } from '../workflows/interfaces'

export type WorkflowFactoryProps = {
  credentialsMap: CredentialsMap
  registry: WorkflowRegistry
}
