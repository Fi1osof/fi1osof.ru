# Internal Transfers

System for transferring Coins between users within the platform.

## Overview

Users can transfer Coins to each other without blockchain interaction. These are internal platform operations.

## Data Model

### Transaction (for transfers)

When transferring, **two related transactions** are created:

```
TransferOut (sender)              TransferIn (receiver)
├── type: TransferOut              ├── type: TransferIn
├── amount: -100                   ├── amount: +100
├── userId: sender.id              ├── userId: receiver.id
├── balanceId: sender.balance.id   ├── balanceId: receiver.balance.id
└── Children: [TransferIn]         └── parentId: TransferOut.id
```

**Parent/Children relationship:**
- `TransferOut` — parent transaction
- `TransferIn` — child transaction with `parentId` pointing to `TransferOut`

## Transfer Process

1. User opens recipient's profile
2. Clicks "Send Transfer"
3. Enters amount and optional comment
4. Confirms transfer

### Server Logic

```
createTransfer(toUserId, amount, title)
│
├── Check authorization
├── Check recipient exists
├── Check toUserId != currentUserId
├── Check sender balance >= amount
│
└── Prisma transaction:
    ├── Create TransferOut (amount: -amount)
    ├── Create TransferIn (amount: +amount, parentId: outTx.id)
    ├── Upsert recipient Balance
    ├── Decrease sender balance
    └── Increase recipient balance
```

## Important Notes

1. **Atomicity**: All operations are executed in a single Prisma transaction. If anything fails — everything is rolled back.

2. **Balance upsert**: Recipient may not have a Balance record (if they never topped up). We use upsert.

3. **Balance check**: Always on the server. We don't trust the frontend.

4. **No self-transfer**: Transfer to self is prohibited.

## GraphQL API

### Mutations

```graphql
mutation CreateTransfer($toUserId: String!, $amount: Float!, $title: String) {
  createTransfer(toUserId: $toUserId, amount: $amount, title: $title) {
    id
    type
    amount
    title
    createdAt
    Children {
      id
      userId
    }
  }
}
```

### Queries

```graphql
query MyTransactions($skip: Int, $take: Int) {
  myTransactions(skip: $skip, take: $take) {
    id
    type
    amount
    title
    createdAt
    User { id username }
    Parent { 
      id 
      userId 
      User { id username }
    }
    Children { 
      id 
      userId 
      User { id username }
    }
  }
}

query MyTransactionsCount {
  myTransactionsCount
}
```
