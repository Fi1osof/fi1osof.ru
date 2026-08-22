import { builder } from 'server/schema/builder'
import { TopUpRequestPayload } from '../inputs'
import {
  createTopUpOffer,
  getRecipientAddress,
  getUsdtContractAddress,
  getChainId,
} from '../helpers/topUp'

builder.mutationField('requestTopUp', (t) =>
  t.field({
    type: TopUpRequestPayload,
    resolve: async (_root, _args, ctx) => {
      const { currentUser } = ctx

      if (!currentUser) {
        throw new Error('Not authenticated')
      }

      const message = createTopUpOffer()
      const recipientAddress = getRecipientAddress()

      return {
        message,
        recipientAddress,
        usdtContractAddress: getUsdtContractAddress(),
        chainId: getChainId(),
      }
    },
  }),
)
