import styled, { css } from 'styled-components'
import { markdownStyles } from '../styles'

export const MarkdownEditorStyled = styled.div`
  ${markdownStyles}

  max-height: 80dvh;
  overflow: auto;

  .content {
    border-bottom: 1px solid #ddd;
    min-height: 100px;
  }
`

export const MarkdownEditorGlobalStyled = css`
  body {
    .mdxeditor-popup-container {
      z-index: 2000;
    }
  }
`
