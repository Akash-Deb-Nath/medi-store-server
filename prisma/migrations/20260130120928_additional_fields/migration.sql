/*
  Warnings:

  - You are about to drop the column `address` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `businessAddress` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `Seller` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "address",
DROP COLUMN "dateOfBirth",
DROP COLUMN "gender",
DROP COLUMN "phoneNumber",
DROP COLUMN "taxId";

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "businessAddress",
DROP COLUMN "dateOfBirth",
DROP COLUMN "gender",
DROP COLUMN "phoneNumber",
DROP COLUMN "taxId";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "address" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "role" TEXT DEFAULT 'customer';
