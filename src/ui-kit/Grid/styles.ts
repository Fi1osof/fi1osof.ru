import styled from 'styled-components'

export type GridStyledProps = {
  $columns?: number
}

export const GridStyled = styled.div<GridStyledProps>(
  ({ $columns }) => `
  display: grid;
  grid-template-columns: repeat( ${$columns}, 1fr);
  grid-template-rows: auto;
  gap: 10px;
`,
)
