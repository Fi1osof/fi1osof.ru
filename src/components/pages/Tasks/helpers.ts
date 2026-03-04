import {
  TasksWithCountQueryVariables,
  TaskQueryVariables,
  TaskStatusEnum,
  SortOrder,
} from 'src/gql/generated'

export function getTasksWithCountQueryVariables(
  status: TaskStatusEnum | null,
  page: number,
  pageSize: number,
): TasksWithCountQueryVariables {
  return {
    where: {
      status: status ?? undefined,
      incompletedOnly: status === null,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: SortOrder.DESC,
    },
  }
}

export function getTaskQueryVariables(
  taskId: string | undefined,
): TaskQueryVariables {
  return {
    where: {
      id: taskId,
    },
  }
}
