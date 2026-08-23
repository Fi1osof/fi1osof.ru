import React from 'react'
import { GridStyled, GridStyledProps } from './styles'

type GridProps = React.AllHTMLAttributes<HTMLDivElement> & {
  columns?: GridStyledProps['$columns']
}

export const Grid: React.FC<GridProps> = ({ children, columns, ...other }) => {
  return (
    <GridStyled $columns={columns} {...other}>
      {children}
    </GridStyled>
  )
}
