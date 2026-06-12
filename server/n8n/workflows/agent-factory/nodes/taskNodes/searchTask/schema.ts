import { MyTasksQueryVariables } from 'src/gql/generated/myTasks'
import { TaskStatusEnum } from 'src/gql/generated/types'
import * as yup from 'yup'

const taskStatusValues = Object.values(TaskStatusEnum)

type SchemaWhereInput = Omit<
  NonNullable<MyTasksQueryVariables['where']>,
  'assigneeId' | 'createdById' | 'id' | 'parentId' | 'projectId'
>

const where: yup.ObjectSchema<SchemaWhereInput> = yup.object().shape({
  status: yup
    .array()
    .of(yup.string().oneOf(taskStatusValues).required())
    .label(`Task status (${taskStatusValues.join(', ')})`),
  incompletedOnly: yup
    .boolean()
    .label('Only incompleted tasks (default: true)'),
})

type SchemaInput = Omit<MyTasksQueryVariables, 'where'> & {
  where?: SchemaWhereInput
}

export const searchTaskSchema: yup.ObjectSchema<SchemaInput> = yup
  .object()
  .shape({
    where,
    skip: yup.number().label('Number of records to skip'),
    take: yup.number().label('Number of records to return'),
  })
