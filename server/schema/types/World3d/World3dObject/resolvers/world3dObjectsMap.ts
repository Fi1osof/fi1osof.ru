import { builder } from '../../../../builder'

builder.queryField('world3dObjectsMap', (t) =>
  t.field({
    type: 'Json',
    nullable: true,
    description: 'Read object and children recursively',
    args: {
      uuid: t.arg.string({ defaultValue: 'root' }),
    },
    resolve: async (_root, args, ctx) => {
      const uuid = args.uuid ?? 'root'

      const path = `/api/objects?uuid=${encodeURIComponent(uuid)}`
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
