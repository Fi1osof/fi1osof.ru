import { Prisma } from '@prisma/client'

interface TaskWorkLogWhereArgs {
  taskId?: string | null
}

export function buildTaskWorkLogWhere(
  where?: TaskWorkLogWhereArgs | null,
): Prisma.TaskWorkLogWhereInput {
  const { taskId, ...other } = where || {}

  return {
    taskId: taskId ?? undefined,
    ...other,
  }
}
