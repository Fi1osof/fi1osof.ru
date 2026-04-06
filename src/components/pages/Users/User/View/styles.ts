import styled from 'styled-components'

export const UserPageActionsStyled = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`

export const UserPageViewToolbarStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const UserPageViewAvatarStyled = styled.img`
  border-radius: 50%;
  float: left;
  margin: 0 15px 15px 0;
  max-width: 100%;
`

export const UserPageViewInfoStyled = styled.div`
  clear: both;
`

export const UserPageViewStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`
