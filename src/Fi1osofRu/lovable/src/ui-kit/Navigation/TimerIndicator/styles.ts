import Link from 'next/link'
import styled, { keyframes, css } from 'styled-components'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`

export const TimerWrapStyled = styled.div<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  min-width: 120px;
  flex: 1 1 auto;
  max-width: 420px;
  padding: ${({ theme }) => theme.space(1)} ${({ theme }) => theme.space(2)};
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ $active, theme }) =>
    $active
      ? css`
          background: ${theme.color.warmSoft};
          border: 1px solid ${theme.color.warm};
        `
      : css`
          background: ${theme.color.surfaceMuted};
          border: 1px dashed ${theme.color.hairline};
        `}
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    max-width: none;
  }
`

export const DotStyled = styled.span<{ $active?: boolean }>`
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active, theme }) =>
    $active ? theme.color.warm : theme.color.inkSubtle};
  ${({ $active }) =>
    $active &&
    css`
      animation: ${pulse} 1.4s ease-in-out infinite;
    `}
`

export const TimeStyled = styled.span<{ $active?: boolean }>`
  flex: 0 0 auto;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.sm};
  font-variant-numeric: tabular-nums;
  color: ${({ $active, theme }) =>
    $active ? theme.color.warm : theme.color.inkMuted};
  font-weight: 600;
`

export const TitleLinkStyled = styled(Link)<{ $active?: boolean }>`
  min-width: 0;
  flex: 1 1 auto;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ $active, theme }) =>
    $active ? theme.color.ink : theme.color.inkMuted};
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.color.warm};
  }
`

export const StopButtonStyled = styled.button`
  flex: 0 0 auto;
  background: transparent;
  border: 0;
  padding: 2px 6px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.warm};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.sm};
  &:hover {
    background: ${({ theme }) => theme.color.warm};
    color: #fff;
  }
`
