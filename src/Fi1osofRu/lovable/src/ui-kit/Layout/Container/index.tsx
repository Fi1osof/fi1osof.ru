import type React from 'react'
import { ContainerStyled } from './styles'
import type { ContainerProps } from './types'

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'wide',
  ...other
}) => (
  <ContainerStyled $size={size} {...other}>
    {children}
  </ContainerStyled>
)
