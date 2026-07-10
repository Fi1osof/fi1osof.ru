import Link from 'next/link'
import React from 'react'
import { KbConceptNoNestingFragment } from 'src/gql/generated'

export function createConceptLink(object: KbConceptNoNestingFragment): string {
  const { id, uri } = object

  return uri || `/concepts/${id}`
}

type ConceptLinkProps = React.PropsWithChildren & {
  object: KbConceptNoNestingFragment | null | undefined
}

export const ConceptLink: React.FC<ConceptLinkProps> = ({
  object,
  children,
}) => {
  if (!object) {
    return null
  }

  const href = createConceptLink(object)

  return <Link href={href}>{children || object.name || object.id}</Link>
}
