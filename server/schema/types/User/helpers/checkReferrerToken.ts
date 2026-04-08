import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_TYPE_REFERRER } from 'server/helpers/jwt'
import {
  ReferrerTokenPayload,
  SignupStrategy,
  signupStrategy,
} from '../interfaces'

type checkReferrerTokenProps = {
  referrerToken: string | null | undefined
}

export function checkReferrerToken({ referrerToken }: checkReferrerTokenProps) {
  let referrerId: string | undefined

  if (referrerToken) {
    const decoded = jwt.verify(
      referrerToken,
      JWT_SECRET,
    ) as Partial<ReferrerTokenPayload>

    if (decoded.type !== JWT_TYPE_REFERRER) {
      throw new Error('Invalid token type')
    }

    referrerId = decoded.userId

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
