/*
  Warnings:

  - You are about to drop the column `image_url` on the `Medicines` table. All the data in the column will be lost.
  - You are about to drop the column `stock_quantity` on the `Medicines` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `stockQuantity` to the `Medicines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicines" DROP COLUMN "image_url",
DROP COLUMN "stock_quantity",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "total_price",
ADD COLUMN     "totalPrice" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pharmacyName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "taxId" TEXT,
    "phoneNumber" TEXT,
    "gender" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "taxId" TEXT,
    "phoneNumber" TEXT,
    "gender" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_userId_key" ON "Seller"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "Medicines_sellerId_categoryId_idx" ON "Medicines"("sellerId", "categoryId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_medicineId_idx" ON "OrderItem"("orderId", "medicineId");

-- CreateIndex
CREATE INDEX "Orders_customerId_idx" ON "Orders"("customerId");

-- CreateIndex
CREATE INDEX "Reviews_customerId_medicineId_idx" ON "Reviews"("customerId", "medicineId");

-- AddForeignKey
ALTER TABLE "Medicines" ADD CONSTRAINT "Medicines_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
