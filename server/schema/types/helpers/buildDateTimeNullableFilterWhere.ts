import { Prisma } from '@prisma/client'
import { DateTimeNullableFilter } from '../inputs'

export function buildDateTimeNullableFilterWhere(
  where: DateTimeNullableFilter | null | undefined,
): Prisma.DateTimeNullableFilter | null | undefined {
  if (!where) {
    return where
  }

  const { equals, gt, gte, lt, lte, not, notIn, in: whereIn } = where

  return {
    equals: equals,
    gt: gt ?? undefined,
    gte: gte ?? undefined,
    lt: lt ?? undefined,
    lte: lte ?? undefined,
    not: not,
    notIn: notIn,
    in: whereIn,
  }
}

export function buildDateTimeFilterWhere(
  where: DateTimeNullableFilter | null | undefined,
): Prisma.DateTimeFilter | undefined {
  if (!where) {
    return undefined
  }

  const { equals, gt, gte, lt, lte, not, notIn, in: whereIn } = where

  return {
    equals: equals ?? undefined,
    gt: gt ?? undefined,
    gte: gte ?? undefined,
    lt: lt ?? undefined,
    lte: lte ?? undefined,
    not: not ?? undefined,
    notIn: notIn ?? undefined,
    in: whereIn ?? undefined,
  }
}
