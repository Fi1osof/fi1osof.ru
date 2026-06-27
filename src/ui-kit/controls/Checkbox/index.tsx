import React from 'react'
import { CheckboxWrapper, CheckboxInput, CheckboxLabel } from './styles'

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  style,
  className,
  ...props
}) => {
  return (
    <CheckboxWrapper style={style} className={className}>
      <CheckboxInput type="checkbox" {...props} />
      <CheckboxLabel>{label}</CheckboxLabel>
    </CheckboxWrapper>
  )
}
