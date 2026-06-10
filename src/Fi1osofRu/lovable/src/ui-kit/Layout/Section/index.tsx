import type React from 'react'
import {
  SectionStyled,
  SectionHeaderStyled,
  SectionTitleStyled,
  SectionEyebrowStyled,
  SectionInnerStyled,
} from './styles'
import type { SectionProps } from './types'

export const Section: React.FC<SectionProps> = ({
  title,
  eyebrow,
  aside,
  children,
  ...other
}) => (
  <SectionStyled {...other}>
    {(title || eyebrow || aside) && (
      <SectionHeaderStyled>
        <div>
          {eyebrow && <SectionEyebrowStyled>{eyebrow}</SectionEyebrowStyled>}
          {title && <SectionTitleStyled>{title}</SectionTitleStyled>}
        </div>
        {aside && <div>{aside}</div>}
      </SectionHeaderStyled>
    )}
    <SectionInnerStyled>{children}</SectionInnerStyled>
  </SectionStyled>
)
