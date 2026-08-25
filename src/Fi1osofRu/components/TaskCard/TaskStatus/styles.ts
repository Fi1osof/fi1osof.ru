import { TaskStatusEnum } from 'src/gql/generated'
import { SelectStyled } from 'src/ui-kit/controls/Select/styles'
import styled, { css } from 'styled-components'

export const TaskCardStatusStyled = styled.div`
  display: contents;

  ${SelectStyled} {
    option {
      ${Object.values(TaskStatusEnum).map((n) => {
        let color: string
        let background: string

        switch (n) {
          case TaskStatusEnum.DONE:
            color = '#166534'
            background = '#dcfce7'
            break
          case TaskStatusEnum.NEW:
            color = '#1e40af'
            background = '#dbeafe'
            break
          case TaskStatusEnum.PROGRESS:
            color = '#92400e'
            background = '#fef3c7'
            break
          case TaskStatusEnum.REJECTED:
            color = '#991b1b'
            background = '#fee2e2'
            break
          default:
            return
        }

        return css`
          &[value='${n}'] {
            color: ${color};
            background-color: ${background};
          }
        `
      })}
    }
  }
`
