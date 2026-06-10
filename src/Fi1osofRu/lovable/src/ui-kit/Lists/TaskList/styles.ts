import styled from 'styled-components'
export const TaskListStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
`
