-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TopUp', 'TransferOut', 'TransferIn');

-- CreateTable
CREATE TABLE "EthAccount" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" VARCHAR(42) NOT NULL,
    "userId" VARCHAR(36),

    CONSTRAINT "EthAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramAccount" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalKey" INTEGER NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "username" TEXT,
    "photo_url" TEXT,
    "auth_date" TIMESTAMP(0),
    "userId" VARCHAR(36) NOT NULL,

    CONSTRAINT "TelegramAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" VARCHAR(36) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "title" TEXT,
    "parentId" VARCHAR(36),
    "balanceId" VARCHAR(36) NOT NULL,
    "ethTransactionId" VARCHAR(36),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EthTransaction" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" VARCHAR(36) NOT NULL,
    "chainId" INTEGER NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "from" VARCHAR(42) NOT NULL,
    "to" VARCHAR(42) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "blockNumber" INTEGER,
    "message" TEXT NOT NULL,
    "signature" TEXT NOT NULL,

    CONSTRAINT "EthTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EthAccount_userId_key" ON "EthAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EthAccount_address_key" ON "EthAccount"("address");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramAccount_externalKey_key" ON "TelegramAccount"("externalKey");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramAccount_userId_key" ON "TelegramAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_userId_key" ON "Balance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_ethTransactionId_key" ON "Transaction"("ethTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "EthTransaction_chainId_txHash_key" ON "EthTransaction"("chainId", "txHash");

-- AddForeignKey
ALTER TABLE "EthAccount" ADD CONSTRAINT "EthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramAccount" ADD CONSTRAINT "TelegramAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "Balance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_ethTransactionId_fkey" FOREIGN KEY ("ethTransactionId") REFERENCES "EthTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EthTransaction" ADD CONSTRAINT "EthTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
