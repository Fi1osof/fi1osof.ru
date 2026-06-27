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

  > * {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`

export const ImageGeneratorResultsStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  img {
    max-width: 100%;
  }
`

export const ImageGeneratorStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
