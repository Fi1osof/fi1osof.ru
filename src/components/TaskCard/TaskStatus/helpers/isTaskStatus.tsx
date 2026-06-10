import { TaskStatusEnum } from 'src/gql/generated'

export function isTaskStatus(value: string): value is TaskStatusEnum {
  return Object.values<string>(TaskStatusEnum).includes(value)
}
