import { builder } from '../../builder'
import { SortOrder } from '../common'
import { StringNullableFilter } from '../inputs'

export const KBConceptOrderByInput = builder.inputType(
  'KBConceptOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: SortOrder }),
      name: t.field({ type: SortOrder }),
      type: t.field({ type: SortOrder }),
    }),
  },
)

export const KBConceptWhereUniqueInput = builder.inputType(
  'KBConceptWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.id({}),
    }),
  },
)

export const KBConceptWhereInput = builder.inputType('KBConceptWhereInput', {
  fields: (t) => ({
    ids: t.stringList({
      deprecationReason: 'Use id instead',
    }),
    id: t.field({
      type: StringNullableFilter,
    }),
    type: t.field({
      type: StringNullableFilter,
    }),
    name: t.field({
      type: StringNullableFilter,
    }),
    description: t.field({
      type: StringNullableFilter,
    }),
    content: t.field({
      type: StringNullableFilter,
    }),
    code: t.field({
      type: StringNullableFilter,
    }),
    createdById: t.field({
      type: StringNullableFilter,
    }),
    parentId: t.field({
      type: StringNullableFilter,
    }),
    rootId: t.field({
      type: StringNullableFilter,
    }),
  }),
})

export const KBConceptCreateInput = builder.inputType('KBConceptCreateInput', {
  fields: (t) => ({
    type: t.string(),
    name: t.string({ required: true }),
    description: t.string(),
    content: t.string(),
    code: t.string(),
    parentId: t.id(),
    rootId: t.id(),
    data: t.field({ type: 'Json' }),
  }),
})

export const KBConceptUpdateInput = builder.inputType('KBConceptUpdateInput', {
  fields: (t) => ({
    type: t.string(),
    name: t.string(),
    description: t.string(),
    content: t.string(),
    code: t.string(),
    parentId: t.id(),
    rootId: t.id(),
    data: t.field({ type: 'Json' }),
  }),
})
