import styled from 'styled-components'

export const HeroStyled = styled.section`
  padding: ${({ theme }) => theme.space(12)} 0 ${({ theme }) => theme.space(8)};
  border-bottom: 1px solid ${({ theme }) => theme.color.hairline};
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    padding: ${({ theme }) => theme.space(8)} 0 ${({ theme }) => theme.space(6)};
  }
`

export const HeroEyebrowStyled = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.color.inkSubtle};
  margin-bottom: ${({ theme }) => theme.space(3)};
`

export const HeroNameStyled = styled.h1`
  font-size: ${({ theme }) => theme.size.h1};
  margin-bottom: ${({ theme }) => theme.space(3)};
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    font-size: 32px;
  }
`

export const HeroDescStyled = styled.p`
  max-width: 640px;
  color: ${({ theme }) => theme.color.inkMuted};
  font-size: ${({ theme }) => theme.size.lg};
`

export const FocusRowStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
  margin-top: ${({ theme }) => theme.space(5)};
`

export const ActivityGridStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space(4)};
  @media (max-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    grid-template-columns: 1fr;
  }
`

export const StatCardStyled = styled.div`
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.hairline};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space(4)};
`

export const StatNumberStyled = styled.div`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 36px;
  color: ${({ theme }) => theme.color.ink};
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.space(2)};
`

export const StatLabelStyled = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.color.inkSubtle};
`

export const AvailabilityWrapStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space(6)};
  @media (max-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: 1fr;
  }
`

export const CommitTimelineStyled = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
`

export const CommitItemStyled = styled.li`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => theme.space(3)};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.hairline};
  border-radius: ${({ theme }) => theme.radius.md};
`

export const CommitTitleStyled = styled.div`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: ${({ theme }) => theme.size.md};
`

export const CommitMetaStyled = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
`

export const CommitBarStyled = styled.div`
  height: 4px;
  background: ${({ theme }) => theme.color.accentSoft};
  border-radius: 2px;
  margin-top: ${({ theme }) => theme.space(2)};
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.color.accent};
    width: 60%;
  }
`
