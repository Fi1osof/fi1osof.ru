import { minWidth } from 'src/theme/helpers'
import styled, { css } from 'styled-components'

export const FilesViewListStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  gap: 16px;
  max-width: 100%;
  width: 100%;

  ${minWidth.sm(css`
    grid-template-columns: repeat(2, 1fr);
  `)}

  ${minWidth.md(css`
    grid-template-columns: repeat(3, 1fr);
  `)}

  ${minWidth.lg(css`
    grid-template-columns: repeat(4, 1fr);
  `)}

  ${minWidth.xl(css`
    grid-template-columns: repeat(6, 1fr);
  `)}
`

export const FilesViewStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
