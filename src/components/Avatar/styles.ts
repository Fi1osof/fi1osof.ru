import styled from 'styled-components'

type AvatarStyledProps = {
  $size: 'small' | 'normal' | 'big'
}

const sizeMap = {
  small: 24,
  normal: 32,
  big: 48,
}

export const AvatarStyled = styled.div<AvatarStyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => sizeMap[$size]}px;
  height: ${({ $size }) => sizeMap[$size]}px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  font-size: ${({ $size }) =>
    $size === 'big' ? '48px' : $size === 'normal' ? '16px' : '12px'};
  font-weight: 500;
  text-transform: uppercase;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
