import styled from 'styled-components'

export const MarkdownStyled = styled.div`
  color: ${({ theme }) => theme.color.ink};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: ${({ theme }) => theme.size.md};
  line-height: 1.65;

  h2 {
    font-family: ${({ theme }) => theme.font.serif};
    font-size: ${({ theme }) => theme.size.h3};
    margin: ${({ theme }) => theme.space(8)} 0 ${({ theme }) => theme.space(3)};
    letter-spacing: -0.01em;
  }
  h3 {
    font-family: ${({ theme }) => theme.font.serif};
    font-size: ${({ theme }) => theme.size.xl};
    margin: ${({ theme }) => theme.space(6)} 0 ${({ theme }) => theme.space(2)};
  }
  p {
    margin: ${({ theme }) => theme.space(3)} 0;
  }
  ul,
  ol {
    margin: ${({ theme }) => theme.space(3)} 0;
    padding-left: ${({ theme }) => theme.space(5)};
  }
  li {
    margin: ${({ theme }) => theme.space(1)} 0;
  }
  strong {
    color: ${({ theme }) => theme.color.ink};
    font-weight: 600;
  }
  em {
    font-style: italic;
    color: ${({ theme }) => theme.color.inkMuted};
  }
  a {
    color: ${({ theme }) => theme.color.accent};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  code {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 0.92em;
    background: ${({ theme }) => theme.color.surfaceMuted};
    padding: 1px 5px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
  pre {
    background: ${({ theme }) => theme.color.surfaceMuted};
    border: 1px solid ${({ theme }) => theme.color.hairline};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: ${({ theme }) => theme.space(4)};
    overflow-x: auto;
    margin: ${({ theme }) => theme.space(4)} 0;
  }
  pre code {
    background: transparent;
    padding: 0;
  }
  blockquote {
    border-left: 3px solid ${({ theme }) => theme.color.accent};
    background: ${({ theme }) => theme.color.accentSoft};
    margin: ${({ theme }) => theme.space(4)} 0;
    padding: ${({ theme }) => theme.space(3)} ${({ theme }) => theme.space(4)};
    color: ${({ theme }) => theme.color.ink};
    border-radius: 0 ${({ theme }) => theme.radius.sm}
      ${({ theme }) => theme.radius.sm} 0;
  }
  blockquote p {
    margin: 0;
  }
  hr {
    border: 0;
    border-top: 1px solid ${({ theme }) => theme.color.hairline};
    margin: ${({ theme }) => theme.space(6)} 0;
  }
`
