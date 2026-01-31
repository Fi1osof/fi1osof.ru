import Web3 from 'web3'

export const ARBITRUM_CHAIN_ID = 42161
export const ARBITRUM_RPC_URL = 'https://arb1.arbitrum.io/rpc'
export const USDT_CONTRACT_ADDRESS =
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'

export function getRecipientAddress(): string {
  const address = process.env.PAYMENT_RECIPIENT_ADDRESS
  if (!address) {
    throw new Error('PAYMENT_RECIPIENT_ADDRESS env is empty')
  }
  return address
}

const TOP_UP_OFFER_MESSAGE = `Соглашение о пополнении баланса

Подписывая это сообщение, вы соглашаетесь со следующими условиями:

1. Вы покупаете внутреннюю валюту платформы (Coins) по курсу 1:1 USDT.
2. Оплата должна быть произведена в USDT в сети Arbitrum.
3. Монеты будут зачислены на ваш счёт после верификации транзакции.
4. Монеты могут использоваться только в рамках платформы и не подлежат возврату.
5. Это односторонняя транзакция, которая не может быть отменена.`

export function createTopUpOffer(): string {
  return TOP_UP_OFFER_MESSAGE
}

export function verifyTopUpOffer(message: string): boolean {
  return message === TOP_UP_OFFER_MESSAGE
}

export function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string,
): boolean {
  try {
    const web3 = new Web3()
    const recoveredAddress = web3.eth.accounts.recover(message, signature)
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()
  } catch {
    return false
  }
}

export interface TransactionVerificationResult {
  success: boolean
  error?: string
  from?: string
  amount?: number
  blockNumber?: number
}

export async function verifyUsdtTransaction(
  txHash: string,
  expectedRecipient: string,
): Promise<TransactionVerificationResult> {
  try {
    const web3 = new Web3(ARBITRUM_RPC_URL)

    // Throttling: wait some seconds before proceeding
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const receipt = await web3.eth.getTransactionReceipt(txHash)
    if (!receipt) {
      return { success: false, error: 'Transaction not found' }
    }

    if (!receipt.status) {
      return { success: false, error: 'Transaction failed' }
    }

    const transferTopic = web3.utils.sha3(
      'Transfer(address,address,uint256)',
    ) as string

    const transferLog = receipt.logs.find(
      (log) =>
        log.address &&
        log.address.toLowerCase() === USDT_CONTRACT_ADDRESS.toLowerCase() &&
        log.topics &&
        log.topics[0] === transferTopic,
    )

    if (!transferLog || !transferLog.topics) {
      return { success: false, error: 'No USDT transfer found in transaction' }
    }

    const toAddress =
      '0x' + (transferLog.topics[2] as string).slice(26).toLowerCase()
    if (toAddress !== expectedRecipient.toLowerCase()) {
      return { success: false, error: 'Wrong recipient address' }
    }

    const amountHex =
      typeof transferLog.data === 'string' ? transferLog.data : '0x0'
    const amountWei = BigInt(amountHex)
    const amountUsdt = Number(amountWei) / 1e6

    if (amountUsdt <= 0) {
      return {
        success: false,
        error: 'Amount must be positive',
      }
    }

    const fromAddress =
      '0x' + (transferLog.topics[1] as string).slice(26).toLowerCase()

    const blockNumber =
      typeof receipt.blockNumber === 'bigint'
        ? Number(receipt.blockNumber)
        : receipt.blockNumber

    return {
      success: true,
      from: fromAddress,
      amount: amountUsdt,
      blockNumber,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
