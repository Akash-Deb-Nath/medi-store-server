/*
  Warnings:

  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "address" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "address" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "address",
DROP COLUMN "dateOfBirth",
DROP COLUMN "gender",
DROP COLUMN "phoneNumber";
