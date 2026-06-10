import type React from 'react'
import { PageStyled, PageInnerStyled } from './styles'
import type { PageProps } from './types'

export const Page: React.FC<PageProps> = ({ children, ...other }) => {
  return (
    <PageStyled {...other}>
      <PageInnerStyled>{children}</PageInnerStyled>
    </PageStyled>
  )
}
