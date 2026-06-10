import type React from 'react'
import { AvatarPanelStyled, AvatarPanelTitleStyled } from './styles'
import type { AvatarPanelProps } from './types'

export const AvatarPanel: React.FC<AvatarPanelProps> = ({
  title,
  children,
  ...other
}) => (
  <AvatarPanelStyled {...other}>
    {title && <AvatarPanelTitleStyled>{title}</AvatarPanelTitleStyled>}
    {children}
  </AvatarPanelStyled>
)
