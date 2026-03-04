import { builder } from '../../../builder'

// World3dObject create input
export const World3dObjectCreateInput = builder.inputType(
  'World3dObjectCreateInput',
  {
    fields: (t) => ({
      parentId: t.string({ defaultValue: 'root' }),
      object: t.field({ type: 'Json', required: true }),
    }),
  },
)

// World3dObject where unique input
export const World3dObjectWhereUniqueInput = builder.inputType(
  'World3dObjectWhereUniqueInput',
  {
    fields: (t) => ({
      uuid: t.string({ required: true }),
    }),
  },
)

// World3dObject update input
export const World3dObjectUpdateInput = builder.inputType(
  'World3dObjectUpdateInput',
  {
    fields: (t) => ({
      object: t.field({ type: 'Json', required: true }),
    }),
  },
)
