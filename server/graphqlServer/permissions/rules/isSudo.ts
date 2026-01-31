import { rule } from 'graphql-shield'
import { PrismaContext } from '../../../context/interfaces'

export const isSudo = rule()((
  _parent: unknown,
  _args: unknown,
  ctx: PrismaContext,
) => {
  return ctx.currentUser?.sudo === true
})
