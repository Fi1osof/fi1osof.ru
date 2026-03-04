import { builder } from '../../../../builder'

builder.mutationField('world3dObjectDelete', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      uuid: t.arg.string({ required: true }),
      cascade: t.arg.boolean({ defaultValue: false }),
    },
    resolve: async (_root, args, ctx) => {
      const uuid = args.uuid
      const cascade = args.cascade ?? false

      const { ok, status } = await ctx.world3dClient.delete(
        `/api/objects/${encodeURIComponent(uuid)}?cascade=${cascade}`,
      )

      if (!ok) {
        throw new Error(`World3D API error: ${status}`)
      }

      return true
    },
  }),
)
