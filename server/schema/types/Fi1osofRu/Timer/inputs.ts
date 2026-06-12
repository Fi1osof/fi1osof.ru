import { builder } from '../../../builder'
import { DateTimeNullableFilter, StringNullableFilter } from '../../inputs'
import { SortOrder } from '../../common'

export const TimerOrderByInput = builder.inputType('TimerOrderByInput', {
  fields: (t) => ({
    createdAt: t.field({ type: SortOrder }),
  }),
})

export const TimerWhereInput = builder.inputType('TimerWhereInput', {
  fields: (t) => ({
    id: t.field({ type: StringNullableFilter }),
    taskId: t.field({ type: StringNullableFilter }),
    createdById: t.field({ type: StringNullableFilter }),
    startedAt: t.field({ type: DateTimeNullableFilter }),
    stoppedAt: t.field({ type: DateTimeNullableFilter }),
  }),
})

export const TimerWhereUniqueInput = builder.inputType(
  'TimerWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.id(),
    }),
  },
)

export const TimerCreateInput = builder.inputType('TimerCreateInput', {
  fields: (t) => ({
    taskId: t.id({ required: true }),
    startedAt: t.field({ type: 'DateTime', required: false }),
  }),
})

export const TimerUpdateDataInput = builder.inputType('TimerUpdateDataInput', {
  fields: (t) => ({
    startedAt: t.field({ type: 'DateTime', required: false }),
    stoppedAt: t.field({ type: 'DateTime', required: false }),
  }),
})
