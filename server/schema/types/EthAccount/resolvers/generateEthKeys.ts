import Web3 from 'web3'
import { builder } from 'server/schema/builder'
import { EthKeysPayload } from '../inputs'

builder.mutationField('generateEthKeys', (t) =>
  t.field({
    type: EthKeysPayload,
    resolve: () => {
      const web3 = new Web3()
      const account = web3.eth.accounts.create()

      return {
        address: account.address,
        privateKey: account.privateKey,
      }
    },
  }),
)
