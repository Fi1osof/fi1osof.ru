import styled, { css } from 'styled-components'
import { FileItemVariant } from './interfaces'

export const FileItemImgStyled = styled.img``

export const FileItemImageWrapperStyled = styled.div`
  border-radius: 8px;
  padding: 8px;
  background: #f3f4f6;

  display: flex;
  align-items: center;
  justify-content: center;

  ${FileItemImgStyled} {
    max-width: 100%;
    max-height: 100%;
    transition: transform 0.2s;
  }
`

export const FileItemErrorStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #9ca3af;
  font-size: 0.75rem;
  text-align: center;
  gap: 4px;

  svg {
    width: 24px;
    height: 24px;
    opacity: 0.6;
  }
`

export const FileItemMetaStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0 0;
  font-size: 0.75rem;
  color: #6b7280;
`

export const FileItemIconStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  svg {
    width: 48px;
    height: 48px;
    color: #6b7280;
  }
`

export const FileItemDownloadStyled = styled.a`
  display: block;
  margin-top: 8px;
  padding: 6px 12px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #374151;
  text-align: center;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: #e5e7eb;
  }
`
export const FileItemTitleStyled = styled.h3`
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
`

type FileItemStyledProps = {
  $variant: FileItemVariant
}

export const FileItemStyled = styled.div<FileItemStyledProps>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #ffffff;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition:
    box-shadow 0.2s,
    transform 0.2s;

  /**
   * Required for text-overflow: ellipsis to work correctly inside a grid container.
   * By default, grid items have min-width: auto, which prevents them from
   * shrinking below their content size. This causes long text to overflow
   * the cell boundaries instead of being truncated with an ellipsis.
   */
  min-width: 0;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);

    ${FileItemImgStyled} {
      transform: scale(1.05);
    }
  }

  ${({ $variant }) => {
    switch ($variant) {
      case 'list':
        return css`
          ${FileItemImageWrapperStyled} {
            position: relative;
            width: 100%;
            aspect-ratio: 1;
            overflow: hidden;
          }
        `

      case 'full':
        return css``
    }
  }}
`
