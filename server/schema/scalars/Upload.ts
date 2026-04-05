import { GraphQLError, GraphQLScalarType } from 'graphql'

export const GraphQLUpload = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue(value) {
    return value
  },
  serialize() {
    throw new GraphQLError('Upload serialization unsupported.')
  },
  parseLiteral(ast) {
    throw new GraphQLError('Upload literal unsupported.', { nodes: ast })
  },
})
