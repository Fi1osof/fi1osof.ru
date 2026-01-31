import { builder } from '../../../builder'

export const CreateTransferInput = builder.inputType('CreateTransferInput', {
  fields: (t) => ({
    toUserId: t.string({ required: true }),
    amount: t.float({ required: true }),
    title: t.string({ required: false }),
  }),
})
