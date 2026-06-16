import styled from 'styled-components'

export const HeroStyled = styled.header`
  padding: ${({ theme }) => theme.space(6)} 0 ${({ theme }) => theme.space(6)};
  border-bottom: 1px solid ${({ theme }) => theme.color.hairline};
`

export const HeroImageStyled = styled.div`
  width: 100%;
  aspect-ratio: 21 / 9;
  margin: ${({ theme }) => theme.space(4)} 0 ${({ theme }) => theme.space(6)};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.color.surfaceMuted};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const TitleStyled = styled.h1`
  font-size: ${({ theme }) => theme.size.h1};
  font-family: ${({ theme }) => theme.font.serif};
  letter-spacing: -0.02em;
  margin: ${({ theme }) => theme.space(3)} 0 ${({ theme }) => theme.space(2)};

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  > :first-child {
    flex: 1;
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    font-size: ${({ theme }) => theme.size.h2};
  }
`

export const DescStyled = styled.div`
  color: ${({ theme }) => theme.color.inkMuted};
  max-width: 720px;
  font-size: ${({ theme }) => theme.size.lg};
  line-height: 1.55;
`

export const MetaRowStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
  align-items: center;
  margin-top: ${({ theme }) => theme.space(4)};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
`

export const ContentWrapStyled = styled.div`
  max-width: 760px;
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

export const RelatedRowStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
`
