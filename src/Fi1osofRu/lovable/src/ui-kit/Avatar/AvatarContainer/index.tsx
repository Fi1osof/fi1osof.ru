import type React from 'react'
import {
  AvatarContainerStyled,
  AvatarSlotStyled,
  AvatarContextStyled,
} from './styles'
import type { AvatarContainerProps } from './types'

export const AvatarContainer: React.FC<AvatarContainerProps> = ({
  currentEntity,
  ...other
}) => (
  <AvatarContainerStyled {...other}>
    <AvatarSlotStyled>3D-аватар · слот</AvatarSlotStyled>
    <AvatarContextStyled>
      <span>контекст:</span>
      <span>
        {currentEntity
          ? `${currentEntity.kind} · ${currentEntity.title}`
          : 'не определён'}
      </span>
    </AvatarContextStyled>
  </AvatarContainerStyled>
)
