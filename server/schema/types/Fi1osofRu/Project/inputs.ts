import { builder } from '../../../builder'
import { DateTimeNullableFilter, StringNullableFilter } from '../../inputs'
import { SortOrder } from '../../common'
import { ProjectStatusEnum } from './enums'

export const ProjectOrderByInput = builder.inputType('ProjectOrderByInput', {
  fields: (t) => ({
    createdAt: t.field({ type: SortOrder }),
    updatedAt: t.field({ type: SortOrder }),
    name: t.field({ type: SortOrder }),
  }),
})

export const ProjectWhereInput = builder.inputType('ProjectWhereInput', {
  fields: (t) => ({
    id: t.field({ type: StringNullableFilter }),
    name: t.field({ type: StringNullableFilter }),
    createdById: t.field({ type: StringNullableFilter }),
    commercial: t.boolean(),
    status: t.field({ type: ProjectStatusEnum }),
    createdAt: t.field({ type: DateTimeNullableFilter }),
  }),
})

export const ProjectWhereUniqueInput = builder.inputType(
  'ProjectWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.string(),
    }),
  },
)

export const ProjectCreateInput = builder.inputType('ProjectCreateInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: false }),
    intro: t.string({ required: false }),
    content: t.string({ required: false }),
    image: t.string({ required: false }),
    commercial: t.boolean({ required: true }),
    status: t.field({ type: ProjectStatusEnum, required: false }),
  }),
})

export const ProjectUpdateDataInput = builder.inputType(
  'ProjectUpdateDataInput',
  {
    fields: (t) => ({
      name: t.string({ required: false }),
      description: t.string({ required: false }),
      intro: t.string({ required: false }),
      content: t.string({ required: false }),
      image: t.string({ required: false }),
      commercial: t.boolean({ required: false }),
      status: t.field({ type: ProjectStatusEnum, required: false }),
    }),
  },
)
