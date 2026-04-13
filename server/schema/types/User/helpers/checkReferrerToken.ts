import { SignupStrategy, signupStrategy } from '../interfaces'
import { TokenType, verifyToken } from './auth'
import { PrismaContext } from 'server/context/interfaces'

type checkReferrerTokenProps = {
  referrerToken: string | null | undefined
  ctx: PrismaContext
}

export async function checkReferrerToken({
  referrerToken,
  ctx,
}: checkReferrerTokenProps) {
  let referrerId: string | null | undefined

  if (referrerToken) {
    const payload = await verifyToken({
      token: referrerToken,
      type: TokenType.Referrer,
      prisma: ctx.prisma,
    })

    referrerId = payload?.userId

    if (!referrerId) {
      throw new Error('Referrer not found')
    }
  } else {
    if (signupStrategy !== SignupStrategy.ANY) {
      throw new Error('Referrer token required')
    }
  }

  return referrerId
}
