import { builder } from '../../builder'
import { StringNullableFilter } from '../inputs'

export const SiteRouteWhereInput = builder.inputType('SiteRouteWhereInput', {
  fields: (t) => ({
    path: t.field({
      type: StringNullableFilter,
    }),
  }),
})

export const SiteRouteWhereUniqueInput = builder.inputType(
  'SiteRouteWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.id(),
      path: t.string(),
    }),
  },
)

export const SiteRouteCreateInput = builder.inputType('SiteRouteCreateInput', {
  fields: (t) => ({
    path: t.string({ required: true }),
    slug: t.string({ required: true }),
    rank: t.int({ required: false }),
    parentId: t.string({ required: false }),
    kBConceptId: t.string({ required: false }),
  }),
})
