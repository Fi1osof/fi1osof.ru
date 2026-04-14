import { useCallback, useState } from 'react'
import { useBoolean } from 'src/hooks/useBoolean'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { TextField } from '../TextField'
import { PasswordFieldStyled } from './styles'

type PasswordFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  const [isEditing, startEdit] = useBoolean()

  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = useCallback(() => setShowPassword((v) => !v), [])

  return (
    <PasswordFieldStyled>
      {isEditing ? (
        <>
          <TextField
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="new-password"
            name="new-password"
            style={{ flex: 1 }}
          />
          <Button
            type="button"
            variant={ComponentVariant.SECONDARY}
            onClick={toggleShowPassword}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="20"
              height="20"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
              <line
                x1="1"
                y1="1"
                x2="23"
                y2="23"
                style={{ opacity: showPassword ? 1 : 0 }}
              />
            </svg>
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant={ComponentVariant.SECONDARY}
          onClick={startEdit}
        >
          Set password
        </Button>
      )}
    </PasswordFieldStyled>
  )
}
