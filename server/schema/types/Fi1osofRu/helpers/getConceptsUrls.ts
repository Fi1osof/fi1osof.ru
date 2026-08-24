import { PrismaContext } from 'server/context/interfaces'
import { ConceptLink } from './validateInternalLinks'
import { createConceptLink } from 'src/components/Link/Concept'

export async function getConceptsUrls(
  ctx: PrismaContext,
): Promise<ConceptLink[]> {
  const concepts = await ctx.prisma.kBConcept.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      uri: true,
    },
  })
  // .filter((n): n is typeof n & { uri: string } => !!n.uri)

  // if (!concepts.length) {
  //   throw new Error('Can not get concepts')
  // }

  return concepts.map((n) => {
    return {
      ...n,
      uri: n.uri || createConceptLink(n),
    }
  })
}
