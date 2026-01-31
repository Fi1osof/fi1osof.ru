# Внутренние переводы

Система переводов Coins между пользователями внутри платформы.

## Обзор

Пользователи могут переводить Coins друг другу без взаимодействия с блокчейном. Это внутренние операции платформы.

## Модель данных

### Transaction (для переводов)

При переводе создаются **две связанные транзакции**:

```
TransferOut (отправитель)          TransferIn (получатель)
├── type: TransferOut              ├── type: TransferIn
├── amount: -100                   ├── amount: +100
├── userId: sender.id              ├── userId: receiver.id
├── balanceId: sender.balance.id   ├── balanceId: receiver.balance.id
└── Children: [TransferIn]         └── parentId: TransferOut.id
```

**Связь Parent/Children:**
- `TransferOut` — родительская транзакция
- `TransferIn` — дочерняя транзакция с `parentId` указывающим на `TransferOut`

## Процесс перевода

1. Пользователь открывает профиль получателя
2. Нажимает "Send Transfer"
3. Вводит сумму и опциональный комментарий
4. Подтверждает перевод

### Серверная логика

```
createTransfer(toUserId, amount, title)
│
├── Проверить авторизацию
├── Проверить существование получателя
├── Проверить toUserId != currentUserId
├── Проверить баланс отправителя >= amount
│
└── Prisma transaction:
    ├── Создать TransferOut (amount: -amount)
    ├── Создать TransferIn (amount: +amount, parentId: outTx.id)
    ├── Upsert Balance получателя
    ├── Уменьшить баланс отправителя
    └── Увеличить баланс получателя
```

## Важные замечания

1. **Атомарность**: Все операции выполняются в одной Prisma-транзакции. Если что-то падает — откатывается всё.

2. **Upsert баланса**: У получателя может не быть записи Balance (если он никогда не пополнял). Используем upsert.

3. **Проверка баланса**: Всегда на сервере. Фронту не доверяем.

4. **Нельзя себе**: Перевод самому себе запрещён.

## GraphQL API

### Мутации

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

### Запросы

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
