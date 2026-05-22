import { minWidth } from 'src/theme/helpers'
import styled, { css } from 'styled-components'

export const ImageGeneratorControlsStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  gap: 16px;

  ${minWidth.md(css`
    grid-template-columns: 2fr 1fr;
  `)}
`

export const ImageGeneratorStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
