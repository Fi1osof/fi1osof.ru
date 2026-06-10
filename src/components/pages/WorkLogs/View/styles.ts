import { Container } from 'src/Fi1osofRu/lovable/src/ui-kit/Layout/Container'
import styled from 'styled-components'

export const WorkLogsViewStyled = styled(Container)``

export const WorkLogsViewListStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`
