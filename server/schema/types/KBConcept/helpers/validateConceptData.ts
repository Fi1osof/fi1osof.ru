import { Prisma } from '@prisma/client'

export function prepareConceptData(
  data: Partial<Prisma.KBConceptCreateInput | Prisma.KBConceptUpdateInput>,
) {
  const { uri } = data

  if (uri && typeof uri === 'string' && !uri.startsWith('/')) {
    throw new Error('uri should starts with slash')
  }

  return {
    uri,
  }
}
