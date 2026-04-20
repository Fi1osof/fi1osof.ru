import { Prisma } from '@prisma/client'
import { StringNullableFilter } from '../inputs'

export function buildStringNullableFilterWhere(
  where: StringNullableFilter | null | undefined,
): Prisma.StringNullableFilter | undefined {
  if (!where) {
    return undefined
  }

  const {
    contains,
    endsWith,
    gt,
    gte,
    lt,
    lte,
    startsWith,
    mode,
    ...typeWhereOther
  } = where

  return {
    ...typeWhereOther,
    contains: contains ?? undefined,
    endsWith: endsWith ?? undefined,
    gt: gt ?? undefined,
    gte: gte ?? undefined,
    lt: lt ?? undefined,
    lte: lte ?? undefined,
    startsWith: startsWith ?? undefined,
    mode: mode ?? undefined,
  }
}

export function buildStringFilterWhere(
  where: StringNullableFilter | null | undefined,
): Prisma.StringFilter | undefined {
  if (!where) {
    return undefined
  }

  const {
    contains,
    endsWith,
    gt,
    gte,
    lt,
    lte,
    startsWith,
    mode,
    equals,
    not,
    notIn,
    in: whereIn,
    ...typeWhereOther
  } = where

  return {
    ...typeWhereOther,
    contains: contains ?? undefined,
    endsWith: endsWith ?? undefined,
    gt: gt ?? undefined,
    gte: gte ?? undefined,
    lt: lt ?? undefined,
    lte: lte ?? undefined,
    startsWith: startsWith ?? undefined,
    mode: mode ?? undefined,
    equals: equals ?? undefined,
    not: not ?? undefined,
    notIn: notIn ?? undefined,
    in: whereIn ?? undefined,
  }
}
