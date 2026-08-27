import { PrismaContext } from 'server/context/interfaces'
import { ConceptLink } from './validateInternalLinks'
import { getConceptsUrls } from './getConceptsUrls'

export async function buildValidUrisSet(
  ctx: PrismaContext,
): Promise<Set<string>> {
  const concepts: ConceptLink[] = await getConceptsUrls(ctx)

  const conceptsUris = concepts.filter((n) => !!n.uri).map((c) => c.uri)

  return new Set(['/', ...conceptsUris])
}
