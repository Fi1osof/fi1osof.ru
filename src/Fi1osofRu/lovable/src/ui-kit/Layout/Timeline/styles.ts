import styled from 'styled-components'

export const TimelineStyled = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
`

export const TimelineItemStyled = styled.li`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: ${({ theme }) => theme.space(6)};
  padding: ${({ theme }) => theme.space(5)} 0;
  border-top: 1px dashed ${({ theme }) => theme.color.hairline};
  &:first-child {
    border-top: 0;
    padding-top: 0;
  }
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.space(2)};
  }
`

export const TimelineMetaStyled = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const TimelineLabelStyled = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.color.accent};
  margin-top: ${({ theme }) => theme.space(1)};
`

export const TimelineContentStyled = styled.div`
  min-width: 0;
`
