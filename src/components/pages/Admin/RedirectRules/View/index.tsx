import {
  AdminRedirectRulesPageViewGridHeaderStyled,
  AdminRedirectRulesPageViewGridRowStyled,
  AdminRedirectRulesPageViewGridStyled,
  AdminRedirectRulesPageViewStyled,
  AdminRedirectRulesPageViewToolbarStyled,
} from './styles'
import { useRedirectRulesQuery } from 'src/gql/generated'
import React, { useCallback } from 'react'
import { useBoolean } from 'src/hooks/useBoolean'
import { Button } from 'src/ui-kit/Button'
import { RedirectRuleForm } from './Form'

export const AdminRedirectRulesPageView: React.FC = () => {
  const response = useRedirectRulesQuery()

  const [formOpened, formOpenedOn, formOpenedOff] = useBoolean(false)

  const onSuccessHandler = useCallback(() => {
    formOpenedOff()
    response.refetch()
  }, [formOpenedOff, response])

  return (
    <AdminRedirectRulesPageViewStyled>
      {formOpened ? (
        <RedirectRuleForm
          onSuccessHandler={onSuccessHandler}
          cancelHandler={formOpenedOff}
        />
      ) : (
        <>
          <AdminRedirectRulesPageViewToolbarStyled>
            <Button onClick={formOpenedOn}>Create rule</Button>
          </AdminRedirectRulesPageViewToolbarStyled>

          <AdminRedirectRulesPageViewGridStyled>
            <AdminRedirectRulesPageViewGridHeaderStyled>
              <div>name</div>
              <div>pattern</div>
              <div>replacement</div>
              <div>patternType</div>
              <div>statusCode</div>
              <div>priority</div>
              <div>comment</div>
              <div>enabled</div>
            </AdminRedirectRulesPageViewGridHeaderStyled>

            {response.data?.redirectRules?.map((n) => {
              const {
                id,
                comment,
                enabled,
                name,
                pattern,
                patternType,
                priority,
                replacement,
                statusCode,
              } = n

              return (
                <AdminRedirectRulesPageViewGridRowStyled key={id}>
                  <div>{name}</div>
                  <div>{pattern}</div>
                  <div>{replacement}</div>
                  <div>{patternType}</div>
                  <div>{statusCode}</div>
                  <div>{priority}</div>
                  <div>{comment}</div>
                  <div>{enabled === true ? '✅' : '❌'}</div>
                </AdminRedirectRulesPageViewGridRowStyled>
              )
            })}
          </AdminRedirectRulesPageViewGridStyled>
        </>
      )}
    </AdminRedirectRulesPageViewStyled>
  )
}
