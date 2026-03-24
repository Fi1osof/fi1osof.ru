import { WorkflowFactory } from '..'
import { WorkflowFactoryProps } from '../interfaces'

export function isWorkflowFactoryClass(
  obj: unknown,
): obj is new (props: WorkflowFactoryProps) => WorkflowFactory {
  return typeof obj === 'function' && obj.prototype instanceof WorkflowFactory
}
