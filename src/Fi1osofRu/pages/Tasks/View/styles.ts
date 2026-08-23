import { Container } from 'src/Fi1osofRu/lovable/src/ui-kit/Layout/Container'
import styled from 'styled-components'

export const TasksViewStyled = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const TasksViewGridStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`
