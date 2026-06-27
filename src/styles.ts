import styled from 'styled-components'

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`

export const Flex1 = styled.div`
  flex: 1;

  &:last-child:empty {
    display: none;
  }
`
