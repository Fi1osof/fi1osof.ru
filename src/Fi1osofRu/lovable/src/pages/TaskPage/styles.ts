import styled from 'styled-components'

export const HeroStyled = styled.header`
  padding: ${({ theme }) => theme.space(8)} 0 ${({ theme }) => theme.space(6)};
  border-bottom: 1px solid ${({ theme }) => theme.color.hairline};
`

export const TitleStyled = styled.h1`
  font-size: ${({ theme }) => theme.size.h2};
  margin: ${({ theme }) => theme.space(3)} 0 ${({ theme }) => theme.space(3)};
`

export const BlockStyled = styled.div`
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.hairline};
  border-left: 3px solid ${({ theme }) => theme.color.warm};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space(4)} ${({ theme }) => theme.space(5)};
`

export const ResultBlockStyled = styled(BlockStyled)`
  border-left-color: ${({ theme }) => theme.color.success};
`

export const LabelStyled = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.color.inkSubtle};
  margin-bottom: ${({ theme }) => theme.space(2)};
`

export const ParaStyled = styled.p`
  color: ${({ theme }) => theme.color.ink};
`

export const MetaRowStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
  align-items: center;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
  margin-top: ${({ theme }) => theme.space(4)};
`

export const RelatedRowStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
`

export const GithubBlockStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.space(3)};
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    grid-template-columns: 1fr;
  }
`

export const GithubCellStyled = styled.div`
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.hairline};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space(4)};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.sm};
`

export const GithubNumStyled = styled.div`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 28px;
  margin-bottom: ${({ theme }) => theme.space(1)};
`
