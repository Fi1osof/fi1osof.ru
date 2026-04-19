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
