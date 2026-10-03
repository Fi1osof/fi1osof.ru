import { MarkdownStyled } from 'src/components/Markdown/styles'
import styled, { css } from 'styled-components'

type MessageStyledProps = { $isUser?: boolean }

export const MessageStyled = styled.div<MessageStyledProps>`
  max-width: 85%;
  padding: 14px 18px;
  border-radius: 20px;
  font-size: 0.9375rem;
  line-height: 1.6;
  align-self: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  background: ${({ $isUser }) => ($isUser ? '#3b82f6' : '#ffffff')};
  color: ${({ $isUser }) => ($isUser ? '#fff' : '#1f2937')};
  border-bottom-right-radius: ${({ $isUser }) => ($isUser ? '6px' : '20px')};
  border-bottom-left-radius: ${({ $isUser }) => ($isUser ? '20px' : '6px')};
  box-shadow: ${({ $isUser }) =>
    $isUser
      ? '0 2px 8px rgba(59, 130, 246, 0.25)'
      : '0 1px 3px rgba(0, 0, 0, 0.08)'};

  ${({ $isUser }) =>
    $isUser &&
    css`
      ${MarkdownStyled} {
        a {
          color: inherit;
        }

        code,
        kbd {
          color: #f8fafc;
          background: #1e3a8a;
          border-color: rgba(255, 255, 255, 0.3);
        }

        pre {
          color: #f8fafc;
          background: #0f172a;
          border-color: #475569;
        }

        pre code {
          color: inherit;
          background: transparent;
        }

        /* Light syntax colors on the user's dark code surface. */
        pre {
          .token {
            color: inherit;
          }

          .token.comment,
          .token.prolog,
          .token.doctype,
          .token.cdata {
            color: #94a3b8;
          }

          .token.punctuation {
            color: #e2e8f0;
          }

          .token.property,
          .token.tag,
          .token.boolean,
          .token.number,
          .token.constant,
          .token.symbol,
          .token.deleted {
            color: #93c5fd;
          }

          .token.selector,
          .token.attr-name,
          .token.string,
          .token.char,
          .token.builtin,
          .token.inserted {
            color: #86efac;
          }

          .token.operator,
          .token.entity,
          .token.url,
          .language-css .token.string,
          .style .token.string,
          .token.atrule,
          .token.attr-value,
          .token.keyword {
            color: #fda4af;
          }

          .token.function,
          .token.class-name {
            color: #c4b5fd;
          }

          .token.regex,
          .token.important,
          .token.variable {
            color: #fde68a;
          }
        }
      }
    `}
`
