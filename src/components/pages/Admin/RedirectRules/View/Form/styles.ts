import styled from 'styled-components'

export const RedirectRuleFormButtonsStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const RedirectRuleFormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`
