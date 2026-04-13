import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { User } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'
import { JWT_SECRET } from 'server/helpers/jwt'

export enum TokenType {
  Auth = 'Auth',
  Referrer = 'Referrer',
}

export interface TokenPayload {
  tokenId: string
  userId: string | null
  type: TokenType
}

function isTokenPayload(payload: JwtPayload | string): payload is TokenPayload {
  if (
    typeof payload !== 'string' &&
    'tokenId' in payload &&
    'userId' in payload &&
    'type' in payload
  ) {
    return true
  } else {
    return false
  }
}

export async function createToken(
  user: User,
  ctx: PrismaContext,
  type: TokenType,
  options?: SignOptions,
): Promise<string> {
  const payload: Omit<TokenPayload, 'tokenId'> = {
    userId: user.id,
    type,
  }

  const signedToken = jwt.sign(payload, JWT_SECRET, options)
  const decoded = jwt.decode(signedToken) as JwtPayload | null

  const token = await ctx.prisma.token.create({
    data: {
      User: {
        connect: { id: user.id },
      },
      expiredAt: decoded?.exp ? new Date(decoded.exp * 1000) : undefined,
    },
  })

  const fullPayload: TokenPayload = {
    ...payload,
    tokenId: token.id,
  }

  return jwt.sign(fullPayload, JWT_SECRET, options)
}

type verifyTokenProps = {
  token: string
  type: TokenType
  prisma: PrismaContext['prisma']
}

export async function verifyToken({
  token,
  type,
  prisma,
}: verifyTokenProps): Promise<TokenPayload | null> {
  try {
    const payload = jwt.verify(token, JWT_SECRET)

    if (!isTokenPayload(payload)) {
      throw new Error('Invalid token prototype type')
    }

    if (payload.type !== type) {
      throw new Error('Invalid token type')
    }

    if (
      !(await prisma.token.findUnique({
        where: {
          id: payload.tokenId,
        },
      }))
    ) {
      throw new Error('Token does not exists')
    } else {
      return payload
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error)
    }

    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
