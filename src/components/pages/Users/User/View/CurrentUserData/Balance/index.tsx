import React, { useCallback, useState } from 'react'
import {
  MeUserFragment,
  useRequestTopUpMutation,
  useTopUpBalanceMutation,
} from 'src/gql/generated'
import {
  BalanceStyled,
  BalanceAmountStyled,
  BalanceFormStyled,
  BalanceInputStyled,
  BalanceAddressStyled,
  BalanceStatusStyled,
} from './styles'
import { Button } from 'src/ui-kit/Button'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { transactionsRefreshQueriesList } from '../Transactions/interfaces'
import { MetaMaskAuth } from 'src/components/Auth/MetaMaskAuth'

const ARBITRUM_CHAIN_ID = 42161

type BalanceProps = {
  currentUser: MeUserFragment
}

export const Balance: React.FC<BalanceProps> = ({ currentUser }) => {
  const ethAccount = currentUser.EthAccount

  const { addMessage } = useSnackbar() || {}
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const [requestTopUp] = useRequestTopUpMutation()
  const [topUpBalance] = useTopUpBalanceMutation({
    refetchQueries: transactionsRefreshQueriesList,
  })

  const handleTopUp = useCallback(async () => {
    if (!window.ethereum?.isMetaMask) {
      addMessage?.('MetaMask is not installed', { variant: 'error' })
      return
    }

    const amountNum = parseFloat(amount)
    if (!amountNum || amountNum <= 0) {
      addMessage?.('Enter a valid amount', { variant: 'error' })
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

      const userAddress = accounts[0]

      if (userAddress.toLowerCase() !== ethAccount?.address?.toLowerCase()) {
        throw new Error('Connected wallet does not match your account')
      }

      const chainId = (await window.ethereum.request({
        method: 'eth_chainId',
      })) as string

      if (parseInt(chainId, 16) !== ARBITRUM_CHAIN_ID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xa4b1' }],
        })
      }

      const topUpRequest = await requestTopUp()

      const requestData = topUpRequest.data?.requestTopUp
      if (!requestData?.message) {
        throw new Error('Failed to get top-up request')
      }

      const signature = (await window.ethereum.request({
        method: 'personal_sign',
        params: [requestData.message, userAddress],
      })) as string

      const amountWei = BigInt(Math.floor(amountNum * 1e6)).toString(16)

      const txHash = (await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: userAddress,
            to: requestData.usdtContractAddress,
            data:
              '0xa9059cbb' +
              requestData.recipientAddress?.slice(2).padStart(64, '0') +
              amountWei.padStart(64, '0'),
          },
        ],
      })) as string

      setStatus('Verifying transaction in blockchain...')

      const result = await topUpBalance({
        variables: {
          data: {
            message: requestData.message,
            signature,
            txHash,
          },
        },
      })

      if (result.data?.topUpBalance) {
        addMessage?.('Balance successfully topped up!', { variant: 'success' })
        setAmount('')
        setStatus(null)
      }
    } catch (error) {
      addMessage?.((error as Error).message || 'Top-up failed', {
        variant: 'error',
      })
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }, [amount, ethAccount?.address, addMessage, requestTopUp, topUpBalance])

  const onChangeAmount = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(event.target.value)
    },
    [],
  )

  return (
    process.env.NEXT_PUBLIC_CRYPTO_ENABLED === 'true' && (
      <BalanceStyled>
        {ethAccount && (
          <BalanceAddressStyled>{ethAccount.address}</BalanceAddressStyled>
        )}
        <BalanceAmountStyled>
          Your balance: {currentUser.Balance?.amount ?? 0} Coins
        </BalanceAmountStyled>
        {ethAccount ? (
          <BalanceFormStyled>
            <BalanceInputStyled
              type="number"
              placeholder="USDT amount"
              value={amount}
              onChange={onChangeAmount}
              disabled={loading}
              min="0"
              step="1"
            />
            <Button
              type="button"
              onClick={handleTopUp}
              disabled={loading || !amount}
              variant={ComponentVariant.PRIMARY}
            >
              {loading ? 'Processing...' : 'Top up'}
            </Button>
          </BalanceFormStyled>
        ) : (
          <>
            Connect MetaMask to be able to top up your balance
            <MetaMaskAuth referrerToken={null} />
          </>
        )}
        {status && <BalanceStatusStyled>{status}</BalanceStatusStyled>}
      </BalanceStyled>
    )
  )
}
