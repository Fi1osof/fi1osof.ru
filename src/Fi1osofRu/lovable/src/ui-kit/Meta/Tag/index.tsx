import type React from 'react'
import { TagStyled } from './styles'
import type { TagProps } from './types'

export const Tag: React.FC<TagProps> = ({
  children,
  tone = 'neutral',
  ...other
}) => (
  <TagStyled $tone={tone} {...other}>
    {children}
  </TagStyled>
)
