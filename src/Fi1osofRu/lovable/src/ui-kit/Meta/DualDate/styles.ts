import styled from 'styled-components'

export const DualDateStyled = styled.div<{ $compact?: boolean }>`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
  display: ${({ $compact }) => ($compact ? 'inline-flex' : 'flex')};
  flex-direction: ${({ $compact }) => ($compact ? 'row' : 'column')};
  gap: ${({ theme, $compact }) => ($compact ? theme.space(3) : '2px')};
`

export const DualDateRowStyled = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space(1)};
`

export const DualDateLabelStyled = styled.span`
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.75;
`
