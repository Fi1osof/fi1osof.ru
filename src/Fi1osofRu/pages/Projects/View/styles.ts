import styled from 'styled-components'

export const HeroStyled = styled.header`
  padding: ${({ theme }) => theme.space(6)} 0 ${({ theme }) => theme.space(6)};
  border-bottom: 1px solid ${({ theme }) => theme.color.hairline};
  margin-bottom: ${({ theme }) => theme.space(6)};
`

export const TitleStyled = styled.h1`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: ${({ theme }) => theme.size.h1};
  letter-spacing: -0.02em;
  margin: ${({ theme }) => theme.space(3)} 0 ${({ theme }) => theme.space(2)};

  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    font-size: ${({ theme }) => theme.size.h2};
  }
`

export const DescStyled = styled.p`
  color: ${({ theme }) => theme.color.inkMuted};
  max-width: 720px;
  font-size: ${({ theme }) => theme.size.lg};
  line-height: 1.55;
`
