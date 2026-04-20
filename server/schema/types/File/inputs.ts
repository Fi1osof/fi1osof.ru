import { builder } from '../../builder'
import { SortOrder } from '../common'
import { StringNullableFilter } from '../inputs'

export const FileOrderByInput = builder.inputType('FileOrderByInput', {
  fields: (t) => ({
    createdAt: t.field({ type: SortOrder }),
    updatedAt: t.field({ type: SortOrder }),
    name: t.field({ type: SortOrder }),
    size: t.field({ type: SortOrder }),
    rank: t.field({ type: SortOrder }),
  }),
})

export const FileWhereUniqueInput = builder.inputType('FileWhereUniqueInput', {
  fields: (t) => ({
    id: t.id({}),
    path: t.string({}),
  }),
})

export const FileWhereInput = builder.inputType('FileWhereInput', {
  fields: (t) => ({
    id: t.field({
      type: StringNullableFilter,
    }),
    name: t.field({
      type: StringNullableFilter,
    }),
    path: t.field({
      type: StringNullableFilter,
    }),
    mimetype: t.field({
      type: StringNullableFilter,
    }),
  }),
})

// export const FileCreateInput = builder.inputType('FileCreateInput', {
//   fields: (t) => ({
//     name: t.string(),
//     description: t.string(),
//     content: t.string(),
//   }),
// })

export const FileUpdateInput = builder.inputType('FileUpdateInput', {
  fields: (t) => ({
    name: t.string(),
    description: t.string(),
    content: t.string(),
  }),
})
