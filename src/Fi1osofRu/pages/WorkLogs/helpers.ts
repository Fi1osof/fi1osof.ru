import {
  TaskWorkLogsWithCountQueryVariables,
  TaskWorkLogQueryVariables,
} from 'src/gql/generated'

export function getWorkLogsWithCountQueryVariables(
  page: number,
  pageSize: number,
): TaskWorkLogsWithCountQueryVariables {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  }
}

export function getWorkLogQueryVariables(
  workLogId: string | undefined,
): TaskWorkLogQueryVariables {
  return {
    where: {
      id: workLogId ?? '',
    },
  }
}
