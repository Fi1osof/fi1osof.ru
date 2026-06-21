import styled, { css } from 'styled-components'

const hStyles = css`
  font-family: ${({ theme }) => theme.font.serif};
  letter-spacing: -0.02em;
  margin: ${({ theme }) => theme.space(3)} 0 ${({ theme }) => theme.space(2)};

  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const H1Styled = styled.h1`
  ${hStyles}

  font-size: ${({ theme }) => theme.size.h1};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    font-size: ${({ theme }) => theme.size.h2};
  }
`

export const H2Styled = styled.h2`
  ${hStyles}

  font-size: ${({ theme }) => theme.size.h2};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    font-size: ${({ theme }) => theme.size.h3};
  }
`

export const H3Styled = styled.h3`
  ${hStyles}

  font-size: ${({ theme }) => theme.size.h3};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    font-size: ${({ theme }) => theme.size.h4};
  }
`
