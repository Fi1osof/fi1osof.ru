import Web3 from 'web3'

export function getChainId(): number {
  const chainId = process.env.CRYPTO_CHAIN_ID
  if (!chainId) {
    throw new Error('CRYPTO_CHAIN_ID env is empty')
  }
  return parseInt(chainId, 10)
}

export function getRpcUrl(): string {
  const rpcUrl = process.env.CRYPTO_RPC_URL
  if (!rpcUrl) {
    throw new Error('CRYPTO_RPC_URL env is empty')
  }
  return rpcUrl
}

export function getUsdtContractAddress(): string {
  const address = process.env.CRYPTO_USDT_CONTRACT_ADDRESS
  if (!address) {
    throw new Error('CRYPTO_USDT_CONTRACT_ADDRESS env is empty')
  }
  return address
}

export function getRecipientAddress(): string {
  const address = process.env.PAYMENT_RECIPIENT_ADDRESS
  if (!address) {
    throw new Error('PAYMENT_RECIPIENT_ADDRESS env is empty')
  }
  return address
}

const TOP_UP_OFFER_MESSAGE = `Balance Top-Up Agreement

By signing this message, you agree to the following terms:

1. You are purchasing the platform's internal currency (Coins) at a 1:1 USDT rate.
2. Payment must be made in USDT on the Arbitrum network.
3. Coins will be credited to your account after transaction verification.
4. Coins can only be used within the platform and are non-refundable.
5. This is a one-way transaction that cannot be cancelled.`

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
    const web3 = new Web3(getRpcUrl())

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
        log.address.toLowerCase() === getUsdtContractAddress().toLowerCase() &&
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
