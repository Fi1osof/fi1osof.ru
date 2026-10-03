import styled from 'styled-components'

export const AdminRedirectRulesPageViewGridRowStyled = styled.div`
  display: contents;
`

export const AdminRedirectRulesPageViewGridHeaderStyled = styled(
  AdminRedirectRulesPageViewGridRowStyled,
)`
  > * {
    font-size: 1.4;
    font-weight: 600;
    text-transform: capitalize;
  }
`

export const AdminRedirectRulesPageViewGridStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(8, auto);
  grid-template-rows: auto;

  > ${AdminRedirectRulesPageViewGridRowStyled} > * {
    border: 1px solid #ddd;
    padding: 2px 5px;
  }
`

export const AdminRedirectRulesPageViewToolbarStyled = styled.div``

export const AdminRedirectRulesPageViewStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
