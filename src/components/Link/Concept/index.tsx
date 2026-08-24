import Link from 'next/link'
import React from 'react'
import { KbConceptNoNestingFragment } from 'src/gql/generated'

export function createConceptLink(
  object: Pick<KbConceptNoNestingFragment, 'id'> & {
    uri: string | null | undefined
  },
): string {
  const { id, uri } = object

  return uri || `/concepts/${id}`
}

type ConceptLinkProps = React.PropsWithChildren & {
  object: KbConceptNoNestingFragment | null | undefined
  className?: string
}

export const ConceptLink: React.FC<ConceptLinkProps> = ({
  object,
  children,
  className,
}) => {
  if (!object) {
    return null
  }

  const href = createConceptLink(object)

  return (
    <Link href={href} className={className}>
      {children || object.name || object.id}
    </Link>
  )
}
