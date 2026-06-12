import { builder } from '../builder'
import { QueryModeEnum } from './enums'

const stringFilterFields = (
  t: Parameters<Parameters<typeof builder.inputType>[1]['fields']>[0],
) => ({
  equals: t.string(),
  in: t.stringList(),
  notIn: t.stringList(),
  lt: t.string(),
  lte: t.string(),
  gt: t.string(),
  gte: t.string(),
  contains: t.string(),
  startsWith: t.string(),
  endsWith: t.string(),
  mode: t.field({ type: QueryModeEnum }),
})

export const StringNullableFilter = builder.inputType('StringNullableFilter', {
  fields: (t) => ({
    ...stringFilterFields(t),
    not: t.field({ type: NestedStringNullableFilter }),
  }),
})

export const NestedStringNullableFilter: ReturnType<typeof builder.inputType> =
  builder.inputType('NestedStringNullableFilter', {
    fields: (t) => ({
      ...stringFilterFields(t),
      not: t.field({ type: NestedStringNullableFilter }),
    }),
  })

export type StringNullableFilter = typeof StringNullableFilter.$inferInput

const dateTimeFilterFields = (
  t: Parameters<Parameters<typeof builder.inputType>[1]['fields']>[0],
) => ({
  equals: t.field({ type: 'DateTime' }),
  in: t.field({ type: ['DateTime'] }),
  notIn: t.field({ type: ['DateTime'] }),
  lt: t.field({ type: 'DateTime' }),
  lte: t.field({ type: 'DateTime' }),
  gt: t.field({ type: 'DateTime' }),
  gte: t.field({ type: 'DateTime' }),
})

export const DateTimeNullableFilter = builder.inputType(
  'DateTimeNullableFilter',
  {
    fields: (t) => ({
      ...dateTimeFilterFields(t),
      not: t.field({ type: NestedDateTimeNullableFilter }),
    }),
  },
)

export const NestedDateTimeNullableFilter: ReturnType<
  typeof builder.inputType
> = builder.inputType('NestedDateTimeNullableFilter', {
  fields: (t) => ({
    ...dateTimeFilterFields(t),
    not: t.field({ type: NestedDateTimeNullableFilter }),
  }),
})

export type DateTimeNullableFilter = typeof DateTimeNullableFilter.$inferInput
