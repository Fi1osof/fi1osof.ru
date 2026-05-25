import React, { useEffect, useState } from 'react'

import {
  AuthPayloadFragment,
  TelegramAuthDataInput,
  useAuthViaTelegramMutation,
} from 'src/gql/generated'
import { useAppContext } from '../AppContext'
import { useSnackbar } from 'src/ui-kit/Snackbar'

type TelegramButtonProps = {
  botName: string
  buttonSize: 'large' | 'medium' | 'small'
  cornerRadius: number
}

type TgAuthData = Omit<TelegramAuthDataInput, 'referrerToken'>

export type TelegramAuthFormProps = {
  onAuthSuccessHandler: ((data?: AuthPayloadFragment) => void) | undefined
  buttonSize?: TelegramButtonProps['buttonSize']
  referrerToken: string | null
}

export const TelegramAuthForm: React.FC<TelegramAuthFormProps> = ({
  onAuthSuccessHandler,
  buttonSize = 'large',
  referrerToken,
}) => {
  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME
  const [container, containerSetter] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!container || !botName) {
      return
    }

    const telegramAuthProps: TelegramButtonProps = {
      botName,
      cornerRadius: 5,
      buttonSize,
    }

    // Load Telegram login script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?7'
    script.async = true
    script.setAttribute('data-telegram-login', telegramAuthProps.botName)
    script.setAttribute('data-size', telegramAuthProps.buttonSize)
    script.setAttribute('data-radius', String(telegramAuthProps.cornerRadius))
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')

    container.appendChild(script)

    // Cleanup on unmount
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).onTelegramAuth
    }
  }, [container, botName, buttonSize])

  const { addMessage } = useSnackbar() || {}

  const { onAuth: onAuthSuccess } = useAppContext()

  const [authMutation] = useAuthViaTelegramMutation()

  useEffect(() => {
    async function onAuth(authData: TgAuthData) {
      try {
        await authMutation({
          variables: {
            tgAuthData: {
              ...authData,
              referrerToken,
            },
          },
        }).then((r) => {
          if (
            r.data?.authViaTelegram?.success &&
            r.data.authViaTelegram.token
          ) {
            onAuthSuccess?.(r.data.authViaTelegram.token)

            onAuthSuccessHandler?.(r.data.authViaTelegram)
          } else {
            throw new Error(r.data?.authViaTelegram?.message || 'Unknown error')
          }
        })
      } catch (error) {
        addMessage?.((error as Error).message || 'Request execution error', {
          variant: 'error',
        })
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).onTelegramAuth = onAuth
  }, [
    addMessage,
    authMutation,
    onAuthSuccess,
    onAuthSuccessHandler,
    referrerToken,
  ])

  return (
    botName && (
      <div
        style={{
          display: 'contents',
        }}
        ref={containerSetter}
      />
    )
  )
}
