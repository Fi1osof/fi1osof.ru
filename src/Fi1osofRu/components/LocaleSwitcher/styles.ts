import styled, { css } from 'styled-components'

export const LocaleSwitcherCheckboxStyled = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`

export const LocaleSwitcherButtonStyled = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const LocaleSwitcherDropdownStyled = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  min-width: 120px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transform: translateY(${({ $open }) => ($open ? 0 : '-8px')});
  transition:
    opacity 0.15s,
    transform 0.15s,
    visibility 0.15s;
  z-index: 10;

  /* CSS-only fallback via hidden checkbox */
  ${LocaleSwitcherCheckboxStyled}:checked ~ & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  ${({ $open }) =>
    $open &&
    css`
      min-width: 200px;
      max-height: 60dvh;
      max-width: 100%;
      overflow: auto;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.border};
        border-radius: 3px;
      }
    `}
`

export const LocaleSwitcherItemStyled = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.muted : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.colors.muted};
  }

  &:first-child {
    border-radius: ${({ theme }) => theme.radii.md}
      ${({ theme }) => theme.radii.md} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${({ theme }) => `${theme.radii.md} ${theme.radii.md}`};
  }
`

export const LocaleSwitcherStyled = styled.div`
  position: relative;
  display: inline-flex;
`
