import { builder } from '../../../../builder'

const EthAccountWhereUniqueInput = builder.inputType(
  'EthAccountWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.string(),
      address: t.string(),
    }),
  },
)

builder.queryField('ethAccount', (t) =>
  t.prismaField({
    type: 'EthAccount',
    nullable: true,
    args: {
      where: t.arg({ type: EthAccountWhereUniqueInput, required: true }),
    },
    resolve: (query, _root, args, ctx) => {
      const { id, address } = args.where

      if (!id && !address) {
        return null
      }

      return ctx.prisma.ethAccount.findFirst({
        ...query,
        where: {
          id: id ?? undefined,
          address: address?.toLowerCase() ?? undefined,
        },
      })
    },
  }),
)
