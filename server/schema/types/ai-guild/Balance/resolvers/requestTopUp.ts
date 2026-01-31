import { builder } from '../../../../builder'
import { TopUpRequestPayload } from '../inputs'
import {
  createTopUpOffer,
  getRecipientAddress,
  USDT_CONTRACT_ADDRESS,
  ARBITRUM_CHAIN_ID,
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
        usdtContractAddress: USDT_CONTRACT_ADDRESS,
        chainId: ARBITRUM_CHAIN_ID,
      }
    },
  }),
)
