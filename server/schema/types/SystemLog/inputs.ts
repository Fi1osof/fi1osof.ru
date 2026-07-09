import { builder } from '../../builder'
import { SystemLogLevelEnum, SystemLogSourceEnum } from './types'

export const CreateSystemLogInput = builder.inputType('CreateSystemLogInput', {
  fields: (t) => ({
    level: t.field({ type: SystemLogLevelEnum, required: true }),
    source: t.field({ type: SystemLogSourceEnum, required: true }),
    message: t.string({ required: true }),
    stack: t.string({ required: false }),
    url: t.string({ required: false }),
    path: t.string({ required: false }),
    statusCode: t.int({ required: false }),
    method: t.string({ required: false }),
    userAgent: t.string({ required: false }),
    referer: t.string({ required: false }),
  }),
})
