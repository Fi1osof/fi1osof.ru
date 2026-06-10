import Link from 'next/link'
import styled, { css } from 'styled-components'
import { ActivityKind } from '../../Status/ActivityIndicator/types'

export const TaskCardStyled = styled(Link)`
  display: grid;
  grid-template-columns: 8px 1fr auto;
  gap: ${({ theme }) => theme.space(4)};
  align-items: stretch;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.hairline};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space(4)};
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.color.warm};
  }
`

type TaskCardRailStyledProps = {
  $kind: ActivityKind
}

export const TaskCardRailStyled = styled.div<TaskCardRailStyledProps>`
  opacity: 0.6;
  border-radius: ${({ theme }) => theme.radius.sm};

  ${({ theme, $kind: k }) => {
    switch (k) {
      case 'active':
        return css`
          color: ${theme.color.accent};
          background: ${theme.color.accentSoft};
        `
      case 'research':
        return css`
          color: ${theme.color.warm};
          background: ${theme.color.warmSoft};
        `
      case 'paused':
        return css`
          color: ${theme.color.inkMuted};
          background: ${theme.color.surfaceMuted};
        `
      case 'done':
        return css`
          color: ${theme.color.success};
          background: #e2efe7;
        `
    }
  }}
`

export const TaskCardBodyStyled = styled.div`
  min-width: 0;
`

export const TaskCardTitleStyled = styled.h3`
  font-size: ${({ theme }) => theme.size.md};
  margin-bottom: 4px;
`

export const TaskCardProblemStyled = styled.p`
  color: ${({ theme }) => theme.color.inkMuted};
  font-size: ${({ theme }) => theme.size.sm};
  margin-bottom: ${({ theme }) => theme.space(2)};
`

export const TaskCardMetaStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
`

export const TaskCardAsideStyled = styled.div`
  display: flex;
  align-items: flex-start;
`
