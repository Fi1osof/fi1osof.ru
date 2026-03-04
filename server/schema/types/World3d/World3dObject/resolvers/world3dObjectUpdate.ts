import { builder } from '../../../../builder'
import {
  World3dObjectWhereUniqueInput,
  World3dObjectUpdateInput,
} from '../inputs'

builder.mutationField('world3dObjectUpdate', (t) =>
  t.field({
    type: 'Json',
    args: {
      where: t.arg({ type: World3dObjectWhereUniqueInput, required: true }),
      data: t.arg({ type: World3dObjectUpdateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const uuid = args.where.uuid
      const body = {
        object: args.data.object as Record<string, unknown>,
      }

      const { data, ok, status } = await ctx.world3dClient.put(
        `/api/objects/${encodeURIComponent(uuid)}`,
        body,
      )

      if (!ok) {
        throw new Error(`World3D API error: ${status}`)
      }

      return data
    },
  }),
)
