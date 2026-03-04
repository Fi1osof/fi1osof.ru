import { builder } from '../../../builder'
import { World3dStatsType } from '../index'

builder.queryField('world3dStats', (t) =>
  t.field({
    type: World3dStatsType,
    resolve: async (_root, _args, ctx) => {
      const { data, ok } = await ctx.world3dClient.get('/api/stats')

      if (!ok || !data) {
        throw new Error('Failed to get world3d stats')
      }

      return data as {
        worldName: string
        nodeCount: number
        snapshotCount: number
      }
    },
  }),
)
