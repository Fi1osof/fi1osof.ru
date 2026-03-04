import { TaskWorkLogsQueryVariables } from 'src/gql/generated'
import { SortOrder } from 'src/gql/generated/types'
import * as yup from 'yup'

export const searchTaskWorkLogSchema: yup.ObjectSchema<TaskWorkLogsQueryVariables> =
  yup.object().shape({
    where: yup.object().shape({
      taskId: yup.string().label('Filter by task ID'),
    }),
    skip: yup.number().label('Number of records to skip'),
    take: yup.number().label('Number of records to return'),
    orderBy: yup
      .object()
      .shape({
        createdAt: yup
          .mixed<SortOrder>()
          .oneOf(Object.values(SortOrder))
          .label('Sort by createdAt'),
      })
      .default(undefined),
  })
