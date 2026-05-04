import styled, { css } from 'styled-components'
import { theme } from 'src/theme'

export const markdownStyles = css`
  /* Headings */
  h1 {
    font-size: 2em;
    margin: 1em 0;
    border-bottom: 1px solid ${theme.colors.border};
    padding-bottom: 0.3em;
  }

  h2 {
    font-size: 1.5em;
    margin: 1em 0;
    border-bottom: 1px solid ${theme.colors.border};
    padding-bottom: 0.3em;
  }

  h3 {
    font-size: 1.25em;
    margin: 1em 0;
  }

  h4,
  h5,
  h6 {
    margin: 1em 0;
    font-weight: 600;
  }

  /* Paragraphs */
  p {
    margin: 1em 0;
  }

  /* Lists */
  ul,
  ol {
    padding-left: 2em;
    margin: 1em 0;
  }

  li + li {
    margin-top: 0.25em;
  }

  /* Blockquotes */
  blockquote {
    margin: 1em 0;
    padding-left: 1em;
    border-left: 4px solid ${theme.colors.gray[300]};
    color: ${theme.colors.text.secondary};
    background: ${theme.colors.gray[50]};
  }

  /* Inline and block code */
  code {
    background-color: ${theme.colors.gray[100]};
    padding: 0.2em 0.4em;
    font-family: monospace;
    border-radius: 4px;
    font-size: 0.95em;
  }

  pre {
    background-color: ${theme.colors.gray[100]};
    padding: 1em;
    overflow-x: auto;
    border-radius: 6px;
    margin: 1em 0;
  }

  pre code {
    background: none;
    padding: 0;
    font-size: 0.95em;
  }

  /* Links */
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
    /* margin: 1em 0; */
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
  }

  th,
  td {
    border: 1px solid ${theme.colors.gray[300]};
    padding: 0.5em;
    text-align: left;
    vertical-align: top;
  }

  thead {
    background: ${theme.colors.gray[50]};
  }

  /* Horizontal rules */
  hr {
    border: none;
    border-top: 1px solid ${theme.colors.border};
    margin: 2em 0;
  }

  /* Task lists (checkboxes) */
  ul.contains-task-list,
  .task-list-item {
    list-style: none;
    padding-left: 0;
  }

  .task-list-item input[type='checkbox'] {
    margin-right: 0.5em;
    vertical-align: middle;
  }

  /* Subscript and Superscript */
  sub,
  sup {
    font-size: 0.75em;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sup {
    top: -0.5em;
  }

  sub {
    bottom: -0.25em;
  }

  /* Footnotes */
  .footnotes {
    margin-top: 2em;
    padding-top: 1em;
    border-top: 1px solid ${theme.colors.border};
    font-size: 0.9em;
    color: ${theme.colors.text.secondary};
  }

  .footnotes ol {
    padding-left: 1.5em;
  }

  .footnote-ref {
    font-size: 0.75em;
    vertical-align: super;
  }

  .footnote-backref {
    margin-left: 0.25em;
  }

  /* Prism syntax highlighting */
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: ${theme.colors.gray[500]};
  }

  .token.punctuation {
    color: ${theme.colors.gray[800]};
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: ${theme.colors.primary};
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: ${theme.colors.success};
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: ${theme.colors.error};
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: ${theme.colors.error};
  }

  .token.function,
  .token.class-name {
    color: #8b5cf6;
  }

  .token.regex,
  .token.important,
  .token.variable {
    color: ${theme.colors.warning};
  }
`

export const MarkdownStyled = styled.div`
  ${markdownStyles}
`
