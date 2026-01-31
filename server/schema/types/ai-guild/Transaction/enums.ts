import { builder } from '../../../builder'
import { TransactionType } from '@prisma/client'

export const TransactionTypeEnum = builder.enumType('TransactionType', {
  values: Object.values(TransactionType),
})
