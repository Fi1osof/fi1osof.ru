# AI Guild Platform

Business logic and specific features of the AI Guild platform.

## Sections

- [Billing](./billing/README.md) — Balance, transactions, payments

## Key Entities

### Authentication
- **EthAccount** — User's Ethereum account (MetaMask). Linked to User (1:1)
- **TelegramAccount** — User's Telegram account. Linked to User (1:1)

### User Balance System
- **Balance** — User balance in coins (1 USDT = 1 Coin)
- **Transaction** — Internal transaction record (top-up, transfer)
- **EthTransaction** — Blockchain transaction record with cryptographic confirmation

### Prisma Models
- `EthAccount` — linked to User (1:1), stores Ethereum address
- `TelegramAccount` — linked to User (1:1), stores Telegram profile data
- `Balance` — linked to User (1:1)
- `Transaction` — linked to Balance and optionally to EthTransaction
- `EthTransaction` — stores blockchain transaction data + signed message as proof
