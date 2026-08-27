import { PrismaContext } from 'server/context/interfaces'

export async function getConceptsUrls(ctx: PrismaContext) {
  const concepts = await ctx.prisma.kBConcept
    .findMany({
      select: {
        id: true,
        uri: true,
      },
    })
    .then((r) => r.filter((n): n is typeof n & { uri: string } => !!n.uri))

  return concepts
}
