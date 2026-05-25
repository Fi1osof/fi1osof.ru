# Balance Top-Up

User tops up balance by sending USDT on Arbitrum network and verifying the transaction.

## Process Diagram

```
Frontend                          Backend                         Blockchain
   │                                 │                                │
   ├─ requestTopUp() ───────────────►│                                │
   │◄─ {message, addresses} ─────────┤                                │
   │                                 │                                │
   ├─ personal_sign(message) ───────────────────────────────────────►│
   │◄─ signature ────────────────────────────────────────────────────┤
   │                                 │                                │
   ├─ eth_sendTransaction(USDT) ────────────────────────────────────►│
   │◄─ txHash ───────────────────────────────────────────────────────┤
   │                                 │                                │
   ├─ topUpBalance(message, signature, txHash) ────────────────────►│
   │                                 ├─ verify offer message ─────────┤
   │                                 ├─ verify signature ─────────────┤
   │                                 ├─ check EthTransaction exists ──┤
   │                                 ├─ verify tx on blockchain ─────►│
   │                                 │◄─ {from, to, amount, block} ───┤
   │                                 ├─ create EthTransaction ────────┤
   │                                 ├─ create Transaction ───────────┤
   │                                 ├─ update Balance ───────────────┤
   │◄─ Balance ──────────────────────┤                                │
```

## Backend Logic

### 1. Top-up Request (`requestTopUp` mutation)
- Returns static offer message, recipient address, USDT contract address, chainId
- Requires no arguments (amount is determined by actual transaction)

### 2. Balance Top-up (`topUpBalance` mutation)

**Input**: `message`, `signature`, `txHash`

**Validation steps**:
1. Check user authentication
2. Check for linked EthAccount
3. Check that `message` matches server offer
4. Check that signature matches user's ETH address
5. Check that `EthTransaction` doesn't exist for `[chainId, txHash]`
6. Verify transaction via Arbitrum RPC:
   - Transaction exists and is successful
   - USDT Transfer event found
   - Recipient matches platform address
   - Amount > 0
   - Sender matches user's ETH account

**On success**:
1. Create `EthTransaction` with all blockchain data + signed message
2. Create `Transaction` linked to `EthTransaction`
3. Increase `Balance.amount` by transaction amount

## Key Files

- `server/schema/types/ai-guild/Balance/resolvers/topUpBalance.ts` — main mutation
- `server/schema/types/ai-guild/Balance/resolvers/requestTopUp.ts` — offer return
- `server/schema/types/ai-guild/Balance/helpers/topUp.ts` — verification helpers and offer text
- `src/components/pages/Users/User/View/CurrentUserData/Balance/index.tsx` — frontend

## Important Design Decisions

### Why save message/signature?
Signed message serves as **proof of user intent**. This is critical for:
- Contract purchases with specific conditions
- Dispute resolution
- Audit

The `message` field contains static offer text:
```
Balance Top-Up Agreement

By signing this message, you agree to the following terms:

1. You are purchasing the platform's internal currency (Coins) at a 1:1 USDT rate.
2. Payment must be made in USDT on the Arbitrum network.
3. Coins will be credited to your account after transaction verification.
4. Coins can only be used within the platform and are non-refundable.
5. This is a one-way transaction that cannot be cancelled.
```

### Why chainId in unique constraint?
The same `txHash` can theoretically exist in different EVM networks. Although unlikely, constraint `[chainId, txHash]` guarantees correctness. Current implementation uses Arbitrum (`chainId: 42161`).

### Why remove setTimeout on frontend?
Previous implementation waited 15 seconds before calling `topUpBalance`. This was removed because:
1. Backend verifies transaction on blockchain — if not yet confirmed, returns error
2. User can retry if transaction is not confirmed
3. Risk of user closing page during waiting is eliminated

### Status message on frontend
After sending transaction, frontend shows "Verifying transaction on blockchain..." below input field to indicate processing on backend.

## Configuration

Environment variables:
- `PAYMENT_RECIPIENT_ADDRESS` — platform address for receiving USDT

Constants in `helpers/topUp.ts`:
- `ARBITRUM_CHAIN_ID = 42161`
- `ARBITRUM_RPC_URL = 'https://arb1.arbitrum.io/rpc'`
- `USDT_CONTRACT_ADDRESS = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'`
