import { builder } from '../../../../builder'
import { EthAccountNoncePayload } from '../inputs'
import { generateNonce, buildSignMessage } from '../helpers/crypto'

builder.mutationField('ethAccountNonce', (t) =>
  t.field({
    type: EthAccountNoncePayload,
    args: {
      address: t.arg.string({ required: true }),
    },
    resolve: async (_root, args) => {
      const { address } = args
      const nonce = generateNonce(address)
      const message = buildSignMessage(nonce)

      return {
        nonce,
        message,
      }
    },
  }),
)
