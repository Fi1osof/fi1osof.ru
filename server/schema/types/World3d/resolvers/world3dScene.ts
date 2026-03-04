import { builder } from '../../../builder'

builder.queryField('world3dScene', (t) =>
  t.field({
    type: 'Json',
    nullable: true,
    description:
      'Get full world scene with all objects as JSON. Used for initial world load.',
    resolve: async (_root, _args, ctx) => {
      const path = '/api/objects?nodeId=root'
      const { data, status, ok } = await ctx.world3dClient.get(path)

      if (!ok) {
        if (status === 404) {
          return null
        }
        throw new Error(`World3D API error: ${status}`)
      }

      return data
    },
  }),
)
