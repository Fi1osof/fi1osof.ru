import { builder } from '../../../../builder'
import { World3dObjectCreateInput } from '../inputs'

builder.mutationField('world3dObjectCreate', (t) =>
  t.field({
    type: 'Json',
    args: {
      data: t.arg({ type: World3dObjectCreateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const body = {
        parentId: args.data.parentId ?? 'root',
        object: args.data.object as Record<string, unknown>,
      }

      const { data, ok, status } = await ctx.world3dClient.post(
        '/api/objects',
        body,
      )

      if (!ok) {
        throw new Error(`World3D API error: ${status}`)
      }

      return data
    },
  }),
)
