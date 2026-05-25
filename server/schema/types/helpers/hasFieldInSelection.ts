import {
  GraphQLResolveInfo,
  SelectionSetNode,
  SelectionNode,
  FragmentDefinitionNode,
  ValueNode,
} from 'graphql'

function getBooleanValue(
  valueNode: ValueNode,
  variableValues: Record<string, unknown>,
): boolean | null {
  if (valueNode.kind === 'BooleanValue') {
    return valueNode.value
  }
  if (valueNode.kind === 'Variable') {
    const varName = valueNode.name.value
    const value = variableValues[varName]
    if (typeof value === 'boolean') {
      return value
    }
  }
  return null
}

function isFieldSkipped(
  selection: SelectionNode,
  variableValues: Record<string, unknown>,
): boolean {
  if (selection.kind !== 'Field') {
    return false
  }

  const skipDirective = selection.directives?.find(
    (d) => d.name.value === 'skip',
  )
  if (skipDirective) {
    const skipIf = skipDirective.arguments?.find(
      (arg) => arg.name.value === 'if',
    )?.value
    if (skipIf) {
      const skipValue = getBooleanValue(skipIf, variableValues)
      if (skipValue === true) {
        return true
      }
    }
  }

  const includeDirective = selection.directives?.find(
    (d) => d.name.value === 'include',
  )
  if (includeDirective) {
    const includeIf = includeDirective.arguments?.find(
      (arg) => arg.name.value === 'if',
    )?.value
    if (includeIf) {
      const includeValue = getBooleanValue(includeIf, variableValues)
      if (includeValue === false) {
        return true
      }
    }
  }

  return false
}

function findFieldInSelectionSet(
  selectionSet: SelectionSetNode,
  fieldName: string,
  fragments: Record<string, FragmentDefinitionNode>,
  variableValues: Record<string, unknown>,
): boolean {
  for (const selection of selectionSet.selections) {
    if (selection.kind === 'Field') {
      if (
        selection.name.value === fieldName &&
        !isFieldSkipped(selection, variableValues)
      ) {
        return true
      }
    } else if (selection.kind === 'FragmentSpread') {
      const fragment = fragments[selection.name.value]
      if (
        fragment &&
        findFieldInSelectionSet(
          fragment.selectionSet,
          fieldName,
          fragments,
          variableValues,
        )
      ) {
        return true
      }
    } else if (selection.kind === 'InlineFragment') {
      if (
        findFieldInSelectionSet(
          selection.selectionSet,
          fieldName,
          fragments,
          variableValues,
        )
      ) {
        return true
      }
    }
  }
  return false
}

export function hasFieldInSelection<T extends object>(
  info: GraphQLResolveInfo,
  fieldName: keyof T,
): boolean {
  for (const fieldNode of info.fieldNodes) {
    if (!fieldNode.selectionSet) {
      continue
    }
    if (
      findFieldInSelectionSet(
        fieldNode.selectionSet,
        fieldName as string,
        info.fragments,
        info.variableValues,
      )
    ) {
      return true
    }
  }
  return false
}
