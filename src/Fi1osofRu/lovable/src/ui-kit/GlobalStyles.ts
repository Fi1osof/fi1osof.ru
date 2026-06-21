import { createGlobalStyle } from 'styled-components'

export const Fi1osofRuGlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    background: ${({ theme }) => theme.color.paper};
    color: ${({ theme }) => theme.color.ink};
    font-family: ${({ theme }) => theme.font.sans};
    font-size: ${({ theme }) => theme.size.md};
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.font.serif};
    font-weight: 600;
    letter-spacing: -0.01em;
    margin: 0;
  }
  p { margin: 0; }
  a { text-decoration: none; }
  button { font-family: inherit; }
  ::selection { background: ${({ theme }) => theme.color.accentSoft}; }
`
