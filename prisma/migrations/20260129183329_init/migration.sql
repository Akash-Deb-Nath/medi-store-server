-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELED');

-- CreateTable
CREATE TABLE "Medicines" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "image_url" TEXT,
    "sellerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "total_price" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "customerId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Medicines" ADD CONSTRAINT "Medicines_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
