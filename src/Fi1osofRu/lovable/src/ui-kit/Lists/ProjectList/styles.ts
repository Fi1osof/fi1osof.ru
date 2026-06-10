import styled from 'styled-components'
export const ProjectListStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.space(4)};
`
