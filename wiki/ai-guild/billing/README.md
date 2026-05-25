# Billing System

User balance and payment processing for the AI Guild platform.

## Overview

Users can top up balance via USDT on Arbitrum network. The system verifies blockchain transactions and credits coins to user balance.

## Sections

- [Balance Top-Up](./top-up.md) — Top-up via MetaMask
- [Internal Transfers](./internal-transfers.md) — Transfers between users

## Data Models

### Balance
User balance in coins. One balance per user.

```
Balance
├── amount: Float (current balance)
├── userId: String (unique, 1:1 with User)
└── Transactions: Transaction[]
```

### Transaction
Internal transaction record for balance changes.

```
Transaction
├── type: TopUp | TransferOut | TransferIn
├── amount: Float
├── title: String (optional description)
├── userId: String
├── balanceId: String
└── ethTransactionId: String? (link to blockchain transaction)
```

### EthTransaction
Ethereum transaction record with cryptographic confirmation.

```
EthTransaction
├── chainId: Int (network identifier, e.g. 42161 for Arbitrum)
├── txHash: String (blockchain transaction hash)
├── from: String (sender address)
├── to: String (recipient address)
├── amount: Float (amount in USDT)
├── blockNumber: Int? (block number for tracking confirmations)
├── message: String (offer text — proof of intent)
├── signature: String (user's cryptographic signature)
└── userId: String
```

**Unique constraint**: `[chainId, txHash]` — the same txHash can exist in different networks.

## Important Notes

1. **Signature storage**: `message` and `signature` are stored in EthTransaction as proof that user agreed to payment terms. This is critical for contract purchases with conditions.

2. **Network consideration**: `chainId` is required because the same `txHash` can theoretically exist in different EVM networks. Uniqueness is ensured within a specific network.

3. **Block number**: Stored for possible confirmation tracking, though current implementation verifies transaction once on submission.
