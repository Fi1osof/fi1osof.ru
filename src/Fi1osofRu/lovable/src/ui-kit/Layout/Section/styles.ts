import styled from 'styled-components'

export const SectionStyled = styled.section`
  padding: ${({ theme }) => theme.space(10)} 0;
  border-top: 1px solid ${({ theme }) => theme.color.hairline};
  &:first-of-type {
    border-top: 0;
  }
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    padding: ${({ theme }) => theme.space(7)} 0;
  }
`

export const SectionHeaderStyled = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(4)};
  margin-bottom: ${({ theme }) => theme.space(6)};
`

export const SectionTitleStyled = styled.h2`
  font-size: ${({ theme }) => theme.size.h3};
`

export const SectionEyebrowStyled = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.color.inkSubtle};
  margin-bottom: ${({ theme }) => theme.space(2)};
`

export const SectionInnerStyled = styled.div``
