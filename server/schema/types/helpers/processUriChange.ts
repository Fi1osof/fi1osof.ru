import { PrismaClient } from '@prisma/client'
import { slugifyUri } from './slugifyUri'
import { createRedirectRuleData } from '../RedirectRule/helpers/createRedirectRuleData'

export async function processUriChange(
  prisma: PrismaClient,
  oldUri: string,
  newUri: string,
): Promise<string> {
  const processedNewUri = slugifyUri(newUri)

  if (oldUri === processedNewUri) {
    return processedNewUri
  }

  await createRedirectRuleData(prisma, {
    name: `Auto redirect: ${oldUri} -> ${processedNewUri}`,
    pattern: oldUri,
    patternType: 'exact',
    replacement: processedNewUri,
    statusCode: 301,
    comment: 'Auto-created on URI change',
  })

  return processedNewUri
}
