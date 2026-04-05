import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import RelayPlugin from '@pothos/plugin-relay'
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { Prisma } from '@prisma/client'
import { prismaClient } from '../prisma'
import { DateTimeResolver, JSONResolver } from 'graphql-scalars'
import { PrismaContext } from 'server/context/interfaces'
import { GraphQLUpload } from './scalars/Upload'

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Context: PrismaContext
  Scalars: {
    DateTime: {
      Input: Date
      Output: Date
    }
    Json: {
      Input: unknown
      Output: unknown
    }
    Upload: {
      Input: unknown
      Output: never
    }
  }
}>({
  plugins: [PrismaPlugin, RelayPlugin, SimpleObjectsPlugin],
  prisma: {
    client: prismaClient,
    dmmf: Prisma.dmmf,
  },
  relay: {},
})

builder.addScalarType('DateTime', DateTimeResolver)
builder.addScalarType('Json', JSONResolver)
builder.addScalarType('Upload', GraphQLUpload)

builder.queryType({})
builder.mutationType({})
