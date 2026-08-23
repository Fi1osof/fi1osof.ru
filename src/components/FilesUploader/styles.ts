import styled, { css } from 'styled-components'

export const DropZoneStyled = styled.div<{ $isDragging?: boolean }>`
  border: 2px dashed var(--color-border, #ccc);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary, #007bff);
    background: var(--color-bg-hover, rgba(0, 123, 255, 0.05));
  }

  ${({ $isDragging }) =>
    $isDragging &&
    css`
      border-color: var(--color-primary, #007bff);
      background: var(--color-bg-hover, rgba(0, 123, 255, 0.1));
    `}
`

export const FilesUploaderStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const FileListStyled = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const FileItemStyled = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: var(--color-bg-secondary, #f5f5f5);
  border-radius: 6px;
`

export const FileInfoStyled = styled.div`
  flex: 1;
  min-width: 0;
`

export const FileNameStyled = styled.div`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FileSizeStyled = styled.div`
  font-size: 12px;
  color: var(--color-text-secondary, #666);
`

export const ProgressBarStyled = styled.div`
  width: 100px;
  height: 6px;
  background: var(--color-bg-tertiary, #e0e0e0);
  border-radius: 3px;
  overflow: hidden;
`

export const ProgressFillStyled = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: var(--color-primary, #007bff);
  transition: width 0.3s ease;
`

export const FileStatusStyled = styled.span<{ $status: string }>`
  font-size: 12px;
  ${({ $status }) => {
    switch ($status) {
      case 'success':
        return css`
          color: var(--color-success, #28a745);
        `
      case 'error':
        return css`
          color: var(--color-error, #dc3545);
        `
      case 'cancelled':
        return css`
          color: var(--color-text-secondary, #666);
        `
      default:
        return ''
    }
  }}
`
