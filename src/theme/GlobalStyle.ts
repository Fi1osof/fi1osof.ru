import { createGlobalStyle } from 'styled-components'
import { theme } from './index'
import { MarkdownEditorGlobalStyled } from 'src/components/Markdown/Editor/styles'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    margin-top: 0;
    margin-bottom: 0;

    &:focus {
      outline: none;
    }
  }

  html, body{
    height: 100%;
    padding: 0;
    margin: 0;
  }

  body {
    font-family: 'Nunito', sans-serif;
    font-size: 16px;
  }

  #__next {
    height: 100%;
  }

  /* a {
    text-decoration: none;
    color: ${theme.colors.foreground};
    
    &:hover {
      text-decoration: underline;
    }
    
    &:active {
      text-decoration: none;
    }
  } */

  input {
    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  button {
    &:enabled {
      cursor: pointer;
    }
    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  ${MarkdownEditorGlobalStyled}
`
