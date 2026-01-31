import React, { useCallback, useState } from 'react'
import { MetaMaskAuthStyled } from './styles'
import {
  useAuthEthAccountMutation,
  useEthAccountNonceMutation,
} from 'src/gql/generated'
import { useAppContext } from 'src/components/AppContext'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string
        params?: unknown[]
      }) => Promise<unknown>
      isMetaMask?: boolean
    }
  }
}

export interface MetaMaskAuthProps {
  onSuccess?: () => void
}

export const MetaMaskAuth: React.FC<MetaMaskAuthProps> = ({ onSuccess }) => {
  const { onAuth } = useAppContext()
  const { addMessage } = useSnackbar() || {}
  const [loading, setLoading] = useState(false)

  const [getNonce] = useEthAccountNonceMutation()
  const [authEthAccount] = useAuthEthAccountMutation()

  const handleConnect = useCallback(async () => {
    if (!window.ethereum?.isMetaMask) {
      addMessage?.('MetaMask is not installed', { variant: 'error' })
      return
    }

    setLoading(true)

    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[]

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]

      const nonceResult = await getNonce({ variables: { address } })
      const nonce = nonceResult.data?.ethAccountNonce?.nonce
      const message = nonceResult.data?.ethAccountNonce?.message

      if (!nonce || !message) {
        throw new Error('Failed to get nonce')
      }

      const signature = (await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      })) as string

      const authResult = await authEthAccount({
        variables: {
          data: { address, signature, nonce },
        },
      })

      if (authResult.data?.response?.token) {
        await onAuth?.(authResult.data.response.token)
        onSuccess?.()
      } else {
        throw new Error(
          authResult.data?.response?.message || 'Authentication failed',
        )
      }
    } catch (error) {
      addMessage?.((error as Error).message || 'Something went wrong', {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [addMessage, authEthAccount, getNonce, onAuth, onSuccess])

  return (
    <MetaMaskAuthStyled>
      <Button
        type="button"
        onClick={handleConnect}
        disabled={loading}
        variant={ComponentVariant.SECONDARY}
      >
        {loading ? 'Connecting...' : 'Connect with MetaMask'}
      </Button>
    </MetaMaskAuthStyled>
  )
}
