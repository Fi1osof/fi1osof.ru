import { builder } from '../../../builder'

export const TopUpRequestPayload = builder.simpleObject('TopUpRequestPayload', {
  fields: (t) => ({
    message: t.string(),
    recipientAddress: t.string(),
    usdtContractAddress: t.string(),
    chainId: t.int(),
  }),
})

export const TopUpBalanceInput = builder.inputType('TopUpBalanceInput', {
  fields: (t) => ({
    message: t.string({ required: true }),
    signature: t.string({ required: true }),
    txHash: t.string({ required: true }),
  }),
})
