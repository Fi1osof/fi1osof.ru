import React from 'react'
import { ComponentSize, ComponentVariant } from '../interfaces'
import { ButtonStyled, ButtonVariant, ButtonSize } from './styles'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button: React.FC<ButtonProps> = ({
  variant = ComponentVariant.PRIMARY,
  size = ComponentSize.MD,
  children,
  type = 'button',
  ...props
}) => {
  return (
    <ButtonStyled $variant={variant} $size={size} type={type} {...props}>
      {children}
    </ButtonStyled>
  )
}
