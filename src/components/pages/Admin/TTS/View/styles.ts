import { minWidth } from 'src/theme/helpers'
import styled, { css } from 'styled-components'

export const AdminTtsPageViewFormButtonsStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`

export const AdminTtsPageViewFormStyled = styled.form``

export const AdminTtsPageViewFormWrapperStyled = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr;
  gap: 10px;

  ${minWidth.md(css`
    grid-template-columns: 1fr 1fr;
  `)}

  > * {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`

export const AdminTtsPageViewStyled = styled.div``
