import styled from 'styled-components'

export const AvatarContainerStyled = styled.aside`
  position: fixed;
  right: ${({ theme }) => theme.space(6)};
  bottom: ${({ theme }) => theme.space(6)};
  width: 220px;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.hairline};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space(3)};
  box-shadow: ${({ theme }) => theme.shadow.soft};
  z-index: 5;
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    right: ${({ theme }) => theme.space(3)};
    bottom: ${({ theme }) => theme.space(3)};
    left: ${({ theme }) => theme.space(3)};
    width: auto;
  }
`

export const AvatarSlotStyled = styled.div`
  height: 96px;
  background: repeating-linear-gradient(
    45deg,
    ${({ theme }) => theme.color.surfaceMuted} 0 8px,
    ${({ theme }) => theme.color.paper} 8px 16px
  );
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
  margin-bottom: ${({ theme }) => theme.space(2)};
`

export const AvatarContextStyled = styled.div`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
  display: flex;
  flex-direction: column;
  gap: 2px;
`
