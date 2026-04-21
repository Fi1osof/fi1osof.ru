import { shield, type IRules } from 'graphql-shield'
// import { isAuthenticated } from './rules/isAuthenticated'
import { isSudo } from './rules/isSudo'

import type { Mutation, Query, User } from 'src/gql/generated/types'
import { isActive } from './rules/isActive'

type UnwrapType<T> = T extends (infer U)[]
  ? UnwrapType<U>
  : T extends null | undefined
    ? never
    : T

type IsGqlObjectType<T> =
  UnwrapType<T> extends { __typename?: unknown } ? true : false

type RuleFields<T> = Partial<
  Record<keyof Omit<T, '__typename'> & string, IRules>
>

type RuleTreeKeys<T> = keyof Omit<T, '__typename'> & string

type RuleTreeRule<T> =
  IsGqlObjectType<T> extends true ? IRules | RuleFields<UnwrapType<T>> : IRules

type RuleTree<T> = Partial<
  Record<RuleTreeKeys<T>, RuleTreeRule<T[RuleTreeKeys<T>]>>
>

type ExtraPermissionTypes = {
  User: User
}

type PermissionsRuleTree = {
  Query: RuleTree<Query>
  Mutation: RuleTree<Mutation>
} & {
  [K in keyof ExtraPermissionTypes]?: RuleTree<ExtraPermissionTypes[K]> | IRules
}

const ruleTree = {
  Query: {
    ethAccount: isSudo,
    ethAccounts: isSudo,
    concepts: isSudo,
    facts: isSudo,
    factParticipations: isSudo,
    factProjections: isSudo,
    knowledgeSpaces: isSudo,
    file: isSudo,
    files: isSudo,
    filesCount: isSudo,
  },
  Mutation: {
    // Example: require authentication for specific mutations
    // someProtectedMutation: isAuthenticated,
    updateUser: isSudo,
    createPost: isActive,
    updatePost: isActive,
    createTask: isActive,
    updateTask: isActive,
    createTaskWorkLog: isActive,
    createMindLog: isActive,
    singleUpload: isActive,
    createReferrerToken: isActive,
    createConcept: isActive,
    createConflict: isActive,
    createConstraint: isActive,
    createDecision: isActive,
    createFact: isActive,
    createFactParticipation: isActive,
    createFactProjection: isActive,
    createIdentityOperation: isActive,
    createKnowledgeSpace: isActive,
    createLabel: isActive,
    createProposal: isActive,
    createReaction: isActive,
    createReflex: isActive,
    deleteConcept: isActive,
    llmCompletion: isSudo,
    llmChatCompletion: isSudo,
    signPost: isActive,
    world3dObjectCreate: isActive,
  },
} satisfies PermissionsRuleTree

export const permissions = shield(ruleTree, {
  /**
   * Allow use new Error() in resolvers
   */
  allowExternalErrors: true,
})
