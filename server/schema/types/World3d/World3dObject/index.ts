import { builder } from '../../../builder'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/world3dObjectsMap'
import './resolvers/world3dObjectCreate'
import './resolvers/world3dObjectDelete'
import './resolvers/world3dObjectUpdate'

// World3dObject stats type
export const World3dStatsType = builder.simpleObject('World3dObjectStats', {
  fields: (t) => ({
    worldName: t.string({ nullable: false }),
    nodeCount: t.int({ nullable: false }),
    snapshotCount: t.int({ nullable: false }),
  }),
})
