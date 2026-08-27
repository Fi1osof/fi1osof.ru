import styled, { css } from 'styled-components'
import { ConceptItemVariant } from './interfaces'

export const ConceptItemMetaStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 8px 0 0;
  font-size: 0.75rem;
  color: #6b7280;
`

export const ConceptItemTitleStyled = styled.h3`
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
`

export const ConceptItemDescriptionStyled = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`

export const ConceptItemTypeStyled = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: #e5e7eb;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #374151;
`

type ConceptItemStyledProps = {
  variant: ConceptItemVariant
}

export const ConceptItemStyled = styled.div<ConceptItemStyledProps>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  min-width: 0;

  ${({ variant }) => {
    switch (variant) {
      case 'list':
        return css`
          &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }
        `

      case 'full':
        return css`
          padding: 24px;
        `
    }
  }}
`
