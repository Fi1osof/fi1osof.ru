import { builder } from 'server/schema/builder'
// import { KBConceptWhereInput } from 'server/schema/types/KBConcept'
import { buildValidUrisSetFi1osofRu } from '../../../helpers/buildValidUrisSet'
import { EntityType, ProcessorResult } from './interfaces'
import { processConcepts } from './processors/processConcepts'
import { processProjects } from './processors/processProjects'
import { processTasks } from './processors/processTasks'
import { processTaskWorkLogs } from './processors/processTaskWorkLogs'

const BulkUpdateLangsEntityType = builder.enumType(
  'BulkUpdateLangsEntityType',
  {
    values: Object.values(EntityType),
  },
)

builder.mutationField('adminBulkUpdateLangs', (t) =>
  t.field({
    type: 'Json',
    args: {
      entities: t.arg({ type: [BulkUpdateLangsEntityType], required: true }),
      // where: t.arg({ type: KBConceptWhereInput }),
      ids: t.arg.stringList(),
      limit: t.arg.int({ required: true }),
      langsLimit: t.arg.int({ required: false }),
      processAllLangs: t.arg.boolean({ required: true }),
      force: t.arg.boolean({ required: true }),
    },
    resolve: async (
      _root,
      {
        entities,
        // where: whereArg,
        ids,
        limit,
        langsLimit,
        processAllLangs,
        force,
      },
      ctx,
    ) => {
      const { currentUser } = ctx

      if (!currentUser?.sudo) {
        throw new Error('Unauthorized')
      }

      const validUris = await buildValidUrisSetFi1osofRu(ctx)

      const results: Record<string, ProcessorResult> = {}

      for (const entityType of entities) {
        switch (entityType) {
          case EntityType.Concept:
            // if (!whereArg) {
            //   throw new Error('where is required for Concept')
            // }
            results[entityType] = await processConcepts({
              ctx,
              // whereArg,
              ids: ids ?? undefined,
              limit,
              langsLimit,
              processAllLangs,
              force,
              validUris,
            })
            break

          case EntityType.Project:
            results[entityType] = await processProjects({
              ctx,
              ids: ids ?? undefined,
              limit,
              langsLimit,
              processAllLangs,
              force,
              validUris,
            })
            break

          case EntityType.Task:
            results[entityType] = await processTasks({
              ctx,
              ids: ids ?? undefined,
              limit,
              langsLimit,
              processAllLangs,
              force,
              validUris,
            })
            break

          case EntityType.TaskWorkLog:
            results[entityType] = await processTaskWorkLogs({
              ctx,
              ids: ids ?? undefined,
              limit,
              langsLimit,
              processAllLangs,
              force,
              validUris,
            })
            break
        }
      }

      return results
    },
  }),
)
