import type React from 'react'
import { EntityLinkStyled, EntityLinkKindStyled } from './styles'
import type { EntityLinkProps } from './types'

export const EntityLink: React.FC<EntityLinkProps> = ({
  href,
  children,
  kind = 'topic',
  // onOpen,
  ...other
}) => (
  <EntityLinkStyled
    href={href}
    $kind={kind}
    // onClick={(e) => {
    //   if (onOpen) {
    //     e.preventDefault()
    //     onOpen(href)
    //   }
    // }}
    {...other}
  >
    <EntityLinkKindStyled>{kind}</EntityLinkKindStyled>
    <span>{children}</span>
  </EntityLinkStyled>
)
