import { builder } from '../../builder'
import { getFieldValueByLang } from '../KBConcept/helpers/getFieldValueByLang'

// TaskWorkLog object type
builder.prismaObject('TaskWorkLog', {
  fields: (t) => ({
    id: t.exposeID('id', {
      nullable: false,
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime', nullable: false }),
    content: t.string({
      resolve(source, _, ctx) {
        return getFieldValueByLang(source, 'content', ctx)
      },
    }),
    taskId: t.exposeID('taskId', { nullable: false }),
    Task: t.relation('Task'),
    createdById: t.exposeID('createdById', { nullable: false }),
    CreatedBy: t.relation('CreatedBy'),
  }),
})

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/taskWorkLog'
import './resolvers/taskWorkLogs'
import './resolvers/taskWorkLogsCount'
import './resolvers/createTaskWorkLog'
import './resolvers/updateTaskWorkLog'
import './resolvers/deleteTaskWorkLog'
