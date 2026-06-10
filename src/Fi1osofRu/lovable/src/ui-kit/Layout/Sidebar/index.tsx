import type React from 'react'
import { SidebarStyled, SidebarAsideStyled, SidebarMainStyled } from './styles'
import type { SidebarProps } from './types'

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  main,
  side = 'right',
  ...other
}) => (
  <SidebarStyled $side={side} {...other}>
    {side === 'left' ? (
      <>
        <SidebarAsideStyled>{children}</SidebarAsideStyled>
        <SidebarMainStyled>{main}</SidebarMainStyled>
      </>
    ) : (
      <>
        <SidebarMainStyled>{main}</SidebarMainStyled>
        <SidebarAsideStyled>{children}</SidebarAsideStyled>
      </>
    )}
  </SidebarStyled>
)
