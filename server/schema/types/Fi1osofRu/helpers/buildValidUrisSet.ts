import { PrismaContext } from 'server/context/interfaces'
import { ConceptLink } from '../../KBConcept/helpers/validateInternalLinks'
import { getConceptsUrls } from '../../KBConcept/helpers/getConceptsUrls'
import { createProjectLink } from 'src/components/Link/Project'
import { createTaskLink } from 'src/components/Link/Task'
import { createWorkLogLink } from 'src/components/Link/WorkLog'

export async function buildValidUrisSetFi1osofRu(
  ctx: PrismaContext,
): Promise<Set<string>> {
  const concepts: ConceptLink[] = await getConceptsUrls(ctx)

  const conceptsUris = concepts.filter((n) => !!n.uri).map((c) => c.uri)

  const projectsLinks: string[] = await ctx.prisma.project
    .findMany({
      select: {
        id: true,
      },
    })
    .then((r) => r.map(createProjectLink))

  const tasksLinks: string[] = await ctx.prisma.task
    .findMany({
      select: {
        id: true,
      },
    })
    .then((r) => r.map(createTaskLink))

  const workLogsLinks: string[] = await ctx.prisma.taskWorkLog
    .findMany({
      select: {
        id: true,
      },
    })
    .then((r) => r.map(createWorkLogLink))

  return new Set([
    '/',
    '/concepts',
    ...conceptsUris,
    ...projectsLinks,
    ...tasksLinks,
    ...workLogsLinks,
  ])
}
