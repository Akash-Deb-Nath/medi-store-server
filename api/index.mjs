// src/app.ts
import express7 from "express";

// src/modules/medicines/medicines.router.ts
import express from "express";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// prisma/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// prisma/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  seller        Seller?\n  customer      Customer?\n\n  role   String? @default("CUSTOMER")\n  status String? @default("active")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cart {\n  id              String   @id @default(uuid())\n  customerId      String   @unique\n  customer        Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  shippingAddress String\n  totalPrice      Int\n  createdAt       DateTime @default(now())\n  updatedAt       DateTime @updatedAt\n\n  items CartItem[]\n}\n\nmodel CartItem {\n  id         String    @id @default(uuid())\n  cartId     String\n  cart       Cart      @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  medicineId String\n  medicine   Medicines @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  quantity   Int\n  price      Int\n\n  @@unique([cartId, medicineId])\n}\n\nmodel Categories {\n  id        String      @id @default(uuid())\n  name      String      @unique @db.VarChar(255)\n  details   String?     @db.Text\n  createdAt DateTime    @default(now())\n  updatedAt DateTime    @updatedAt\n  medicines Medicines[]\n}\n\nmodel Customer {\n  id          String    @id @default(uuid())\n  userId      String    @unique\n  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  role        String\n  phoneNumber String?\n  dateOfBirth DateTime?\n  gender      String?\n  address     String?\n  createdAt   DateTime  @default(now())\n\n  orders  Orders[]\n  reviews Reviews[]\n  carts   Cart[]\n}\n\nenum OrderStatus {\n  PENDING\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELED\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n}\n\nmodel Medicines {\n  id            String     @id @default(uuid())\n  name          String     @db.VarChar(255)\n  manufacturer  String\n  price         Int\n  stockQuantity Int\n  imageUrl      String?\n  sellerId      String\n  seller        Seller     @relation(fields: [sellerId], references: [id], onDelete: Cascade)\n  categoryId    String\n  category      Categories @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n\n  orderItems OrderItem[]\n  reviews    Reviews[]\n  cartItems  CartItem[]\n\n  @@index([sellerId, categoryId])\n}\n\nmodel Orders {\n  id              String        @id @default(uuid())\n  customerId      String\n  customer        Customer      @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  totalPrice      Int\n  status          OrderStatus\n  paymentStatus   PaymentStatus @default(UNPAID)\n  ShippingAddress String        @default("")\n  orderedAt       DateTime      @default(now())\n  updatedAt       DateTime      @updatedAt\n\n  items   OrderItem[]\n  payment Payment?\n\n  @@index([customerId])\n}\n\nmodel OrderItem {\n  id         String    @id @default(uuid())\n  orderId    String\n  order      Orders    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  medicineId String\n  medicine   Medicines @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  quantity   Int\n  price      Int\n\n  @@index([orderId, medicineId])\n}\n\nmodel Payment {\n  id                 String        @id @default(uuid(7))\n  amount             Float\n  transactionId      String        @unique @db.Uuid()\n  stripeEventId      String?       @unique\n  status             PaymentStatus @default(UNPAID)\n  paymentGatewayData Json?\n  createdAt          DateTime      @default(now())\n  updatedAt          DateTime      @updatedAt\n\n  orderId String @unique\n  orders  Orders @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  @@index([orderId])\n  @@index([transactionId])\n  @@map("payments")\n}\n\nmodel Reviews {\n  id         String    @id @default(uuid())\n  rating     Int\n  comment    String?   @db.Text\n  customerId String\n  customer   Customer  @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  medicineId String\n  medicine   Medicines @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  createdAt  DateTime  @default(now())\n  updatedAt  DateTime  @updatedAt\n\n  @@index([customerId, medicineId])\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Seller {\n  id            String    @id @default(uuid())\n  userId        String    @unique\n  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  pharmacyName  String\n  licenseNumber String\n  role          String\n  phoneNumber   String?\n  dateOfBirth   DateTime?\n  gender        String?\n  address       String?\n  createdAt     DateTime  @default(now())\n\n  medicines Medicines[]\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"seller","kind":"object","type":"Seller","relationName":"SellerToUser"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"Customer","relationName":"CartToCustomer"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"totalPrice","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicines","relationName":"CartItemToMedicines"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Int"}],"dbName":null},"Categories":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"CategoriesToMedicines"}],"dbName":null},"Customer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CustomerToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"gender","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"orders","kind":"object","type":"Orders","relationName":"CustomerToOrders"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"CustomerToReviews"},{"name":"carts","kind":"object","type":"Cart","relationName":"CartToCustomer"}],"dbName":null},"Medicines":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"stockQuantity","kind":"scalar","type":"Int"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"Seller","relationName":"MedicinesToSeller"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Categories","relationName":"CategoriesToMedicines"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicinesToOrderItem"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"MedicinesToReviews"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMedicines"}],"dbName":null},"Orders":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToOrders"},{"name":"totalPrice","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"ShippingAddress","kind":"scalar","type":"String"},{"name":"orderedAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderItemToOrders"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrdersToPayment"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Orders","relationName":"OrderItemToOrders"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicines","relationName":"MedicinesToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Int"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"orders","kind":"object","type":"Orders","relationName":"OrdersToPayment"}],"dbName":"payments"},"Reviews":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToReviews"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicines","relationName":"MedicinesToReviews"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Seller":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SellerToUser"},{"name":"pharmacyName","kind":"scalar","type":"String"},{"name":"licenseNumber","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"gender","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"MedicinesToSeller"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","seller","medicines","_count","category","orders","customer","medicine","reviews","cart","items","carts","payment","order","orderItems","cartItems","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","_avg","_sum","Cart.groupBy","Cart.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Categories.findUnique","Categories.findUniqueOrThrow","Categories.findFirst","Categories.findFirstOrThrow","Categories.findMany","Categories.createOne","Categories.createMany","Categories.createManyAndReturn","Categories.updateOne","Categories.updateMany","Categories.updateManyAndReturn","Categories.upsertOne","Categories.deleteOne","Categories.deleteMany","Categories.groupBy","Categories.aggregate","Customer.findUnique","Customer.findUniqueOrThrow","Customer.findFirst","Customer.findFirstOrThrow","Customer.findMany","Customer.createOne","Customer.createMany","Customer.createManyAndReturn","Customer.updateOne","Customer.updateMany","Customer.updateManyAndReturn","Customer.upsertOne","Customer.deleteOne","Customer.deleteMany","Customer.groupBy","Customer.aggregate","Medicines.findUnique","Medicines.findUniqueOrThrow","Medicines.findFirst","Medicines.findFirstOrThrow","Medicines.findMany","Medicines.createOne","Medicines.createMany","Medicines.createManyAndReturn","Medicines.updateOne","Medicines.updateMany","Medicines.updateManyAndReturn","Medicines.upsertOne","Medicines.deleteOne","Medicines.deleteMany","Medicines.groupBy","Medicines.aggregate","Orders.findUnique","Orders.findUniqueOrThrow","Orders.findFirst","Orders.findFirstOrThrow","Orders.findMany","Orders.createOne","Orders.createMany","Orders.createManyAndReturn","Orders.updateOne","Orders.updateMany","Orders.updateManyAndReturn","Orders.upsertOne","Orders.deleteOne","Orders.deleteMany","Orders.groupBy","Orders.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Reviews.findUnique","Reviews.findUniqueOrThrow","Reviews.findFirst","Reviews.findFirstOrThrow","Reviews.findMany","Reviews.createOne","Reviews.createMany","Reviews.createManyAndReturn","Reviews.updateOne","Reviews.updateMany","Reviews.updateManyAndReturn","Reviews.upsertOne","Reviews.deleteOne","Reviews.deleteMany","Reviews.groupBy","Reviews.aggregate","Seller.findUnique","Seller.findUniqueOrThrow","Seller.findFirst","Seller.findFirstOrThrow","Seller.findMany","Seller.createOne","Seller.createMany","Seller.createManyAndReturn","Seller.updateOne","Seller.updateMany","Seller.updateManyAndReturn","Seller.upsertOne","Seller.deleteOne","Seller.deleteMany","Seller.groupBy","Seller.aggregate","AND","OR","NOT","id","userId","pharmacyName","licenseNumber","role","phoneNumber","dateOfBirth","gender","address","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","rating","comment","customerId","medicineId","updatedAt","amount","transactionId","stripeEventId","PaymentStatus","status","paymentGatewayData","orderId","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","quantity","price","totalPrice","OrderStatus","paymentStatus","ShippingAddress","orderedAt","name","manufacturer","stockQuantity","imageUrl","sellerId","categoryId","details","cartId","shippingAddress","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","cartId_medicineId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "zAaGAeABEAQAALwDACAFAAC9AwAgBgAAvgMAIAsAAL8DACD9AQAAugMAMP4BAAA6ABD_AQAAugMAMIACAQAAAAGEAgEAiwMAIYkCQACNAwAhnAJAAI0DACGhAgEAiwMAIbECAQCKAwAhyQIBAAAAAcoCIAC7AwAhywIBAIsDACEBAAAAAQAgDAMAAI4DACD9AQAA1AMAMP4BAAADABD_AQAA1AMAMIACAQCKAwAhgQIBAIoDACGJAkAAjQMAIZwCQACNAwAhvAJAAI0DACHGAgEAigMAIccCAQCLAwAhyAIBAIsDACEDAwAAoAQAIMcCAADVAwAgyAIAANUDACAMAwAAjgMAIP0BAADUAwAw_gEAAAMAEP8BAADUAwAwgAIBAAAAAYECAQCKAwAhiQJAAI0DACGcAkAAjQMAIbwCQACNAwAhxgIBAAAAAccCAQCLAwAhyAIBAIsDACEDAAAAAwAgAQAABAAwAgAABQAgEQMAAI4DACD9AQAA0wMAMP4BAAAHABD_AQAA0wMAMIACAQCKAwAhgQIBAIoDACGJAkAAjQMAIZwCQACNAwAhvQIBAIoDACG-AgEAigMAIb8CAQCLAwAhwAIBAIsDACHBAgEAiwMAIcICQACMAwAhwwJAAIwDACHEAgEAiwMAIcUCAQCLAwAhCAMAAKAEACC_AgAA1QMAIMACAADVAwAgwQIAANUDACDCAgAA1QMAIMMCAADVAwAgxAIAANUDACDFAgAA1QMAIBEDAACOAwAg_QEAANMDADD-AQAABwAQ_wEAANMDADCAAgEAAAABgQIBAIoDACGJAkAAjQMAIZwCQACNAwAhvQIBAIoDACG-AgEAigMAIb8CAQCLAwAhwAIBAIsDACHBAgEAiwMAIcICQACMAwAhwwJAAIwDACHEAgEAiwMAIcUCAQCLAwAhAwAAAAcAIAEAAAgAMAIAAAkAIA8DAACOAwAgBwAAjwMAIP0BAACJAwAw_gEAAAsAEP8BAACJAwAwgAIBAIoDACGBAgEAigMAIYICAQCKAwAhgwIBAIoDACGEAgEAigMAIYUCAQCLAwAhhgJAAIwDACGHAgEAiwMAIYgCAQCLAwAhiQJAAI0DACEBAAAACwAgEgYAANEDACAJAADSAwAgDQAArAMAIBMAAM0DACAUAADJAwAg_QEAANADADD-AQAADQAQ_wEAANADADCAAgEAigMAIYkCQACNAwAhnAJAAI0DACGrAgIAxAMAIbECAQCKAwAhsgIBAIoDACGzAgIAxAMAIbQCAQCLAwAhtQIBAIoDACG2AgEAigMAIQYGAADuBQAgCQAA9QUAIA0AAJUFACATAADzBQAgFAAA8gUAILQCAADVAwAgEgYAANEDACAJAADSAwAgDQAArAMAIBMAAM0DACAUAADJAwAg_QEAANADADD-AQAADQAQ_wEAANADADCAAgEAAAABiQJAAI0DACGcAkAAjQMAIasCAgDEAwAhsQIBAIoDACGyAgEAigMAIbMCAgDEAwAhtAIBAIsDACG1AgEAigMAIbYCAQCKAwAhAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACABAAAADQAgCgwAAMYDACASAACiAwAg_QEAAM8DADD-AQAAEwAQ_wEAAM8DADCAAgEAigMAIZsCAQCKAwAhowIBAIoDACGqAgIAxAMAIasCAgDEAwAhAgwAAPEFACASAACyBAAgCgwAAMYDACASAACiAwAg_QEAAM8DADD-AQAAEwAQ_wEAAM8DADCAAgEAAAABmwIBAIoDACGjAgEAigMAIaoCAgDEAwAhqwICAMQDACEDAAAAEwAgAQAAFAAwAgAAFQAgDgsAAMgDACAPAADNAwAgEQAAzgMAIP0BAADLAwAw_gEAABcAEP8BAADLAwAwgAIBAIoDACGaAgEAigMAIZwCQACNAwAhoQIAAMwDrgIirAICAMQDACGuAgAAoAOhAiKvAgEAigMAIbACQACNAwAhAwsAAO8FACAPAADzBQAgEQAA9AUAIA4LAADIAwAgDwAAzQMAIBEAAM4DACD9AQAAywMAMP4BAAAXABD_AQAAywMAMIACAQAAAAGaAgEAigMAIZwCQACNAwAhoQIAAMwDrgIirAICAMQDACGuAgAAoAOhAiKvAgEAigMAIbACQACNAwAhAwAAABcAIAEAABgAMAIAABkAIAwLAADIAwAgDAAAxgMAIP0BAADKAwAw_gEAABsAEP8BAADKAwAwgAIBAIoDACGJAkAAjQMAIZgCAgDEAwAhmQIBAIsDACGaAgEAigMAIZsCAQCKAwAhnAJAAI0DACEDCwAA7wUAIAwAAPEFACCZAgAA1QMAIAwLAADIAwAgDAAAxgMAIP0BAADKAwAw_gEAABsAEP8BAADKAwAwgAIBAAAAAYkCQACNAwAhmAICAMQDACGZAgEAiwMAIZoCAQCKAwAhmwIBAIoDACGcAkAAjQMAIQMAAAAbACABAAAcADACAAAdACALCwAAyAMAIA8AAMkDACD9AQAAxwMAMP4BAAAfABD_AQAAxwMAMIACAQCKAwAhiQJAAI0DACGaAgEAigMAIZwCQACNAwAhrAICAMQDACG5AgEAigMAIQILAADvBQAgDwAA8gUAIAsLAADIAwAgDwAAyQMAIP0BAADHAwAw_gEAAB8AEP8BAADHAwAwgAIBAAAAAYkCQACNAwAhmgIBAAAAAZwCQACNAwAhrAICAMQDACG5AgEAigMAIQMAAAAfACABAAAgADACAAAhACAKDAAAxgMAIA4AAMUDACD9AQAAwwMAMP4BAAAjABD_AQAAwwMAMIACAQCKAwAhmwIBAIoDACGqAgIAxAMAIasCAgDEAwAhuAIBAIoDACECDAAA8QUAIA4AAPAFACALDAAAxgMAIA4AAMUDACD9AQAAwwMAMP4BAAAjABD_AQAAwwMAMIACAQAAAAGbAgEAigMAIaoCAgDEAwAhqwICAMQDACG4AgEAigMAIcwCAADCAwAgAwAAACMAIAEAACQAMAIAACUAIAEAAAAjACABAAAAFwAgAQAAABsAIAEAAAAfACADAAAAEwAgAQAAFAAwAgAAFQAgDQoAAKIDACD9AQAAngMAMP4BAAAsABD_AQAAngMAMIACAQCKAwAhiQJAAI0DACGcAkAAjQMAIZ0CCACfAwAhngIBAMADACGfAgEAiwMAIaECAACgA6ECIqICAAChAwAgowIBAIoDACEBAAAALAAgAQAAABMAIAMAAAAbACABAAAcADACAAAdACADAAAAIwAgAQAAJAAwAgAAJQAgAQAAABMAIAEAAAAbACABAAAAIwAgAQAAAA0AIA8DAACOAwAgCgAAqwMAIA0AAKwDACAQAACtAwAg_QEAAKoDADD-AQAANQAQ_wEAAKoDADCAAgEAigMAIYECAQCKAwAhhAIBAIoDACGFAgEAiwMAIYYCQACMAwAhhwIBAIsDACGIAgEAiwMAIYkCQACNAwAhAQAAADUAIAEAAAADACABAAAABwAgAQAAAAEAIBAEAAC8AwAgBQAAvQMAIAYAAL4DACALAAC_AwAg_QEAALoDADD-AQAAOgAQ_wEAALoDADCAAgEAigMAIYQCAQCLAwAhiQJAAI0DACGcAkAAjQMAIaECAQCLAwAhsQIBAIoDACHJAgEAigMAIcoCIAC7AwAhywIBAIsDACEHBAAA7AUAIAUAAO0FACAGAADuBQAgCwAA7wUAIIQCAADVAwAgoQIAANUDACDLAgAA1QMAIAMAAAA6ACABAAA7ADACAAABACADAAAAOgAgAQAAOwAwAgAAAQAgAwAAADoAIAEAADsAMAIAAAEAIA0EAADoBQAgBQAA6QUAIAYAAOoFACALAADrBQAggAIBAAAAAYQCAQAAAAGJAkAAAAABnAJAAAAAAaECAQAAAAGxAgEAAAAByQIBAAAAAcoCIAAAAAHLAgEAAAABARoAAD8AIAmAAgEAAAABhAIBAAAAAYkCQAAAAAGcAkAAAAABoQIBAAAAAbECAQAAAAHJAgEAAAABygIgAAAAAcsCAQAAAAEBGgAAQQAwARoAAEEAMA0EAADCBQAgBQAAwwUAIAYAAMQFACALAADFBQAggAIBANkDACGEAgEA2gMAIYkCQADcAwAhnAJAANwDACGhAgEA2gMAIbECAQDZAwAhyQIBANkDACHKAiAAwQUAIcsCAQDaAwAhAgAAAAEAIBoAAEQAIAmAAgEA2QMAIYQCAQDaAwAhiQJAANwDACGcAkAA3AMAIaECAQDaAwAhsQIBANkDACHJAgEA2QMAIcoCIADBBQAhywIBANoDACECAAAAOgAgGgAARgAgAgAAADoAIBoAAEYAIAMAAAABACAhAAA_ACAiAABEACABAAAAAQAgAQAAADoAIAYIAAC-BQAgJwAAwAUAICgAAL8FACCEAgAA1QMAIKECAADVAwAgywIAANUDACAM_QEAALYDADD-AQAATQAQ_wEAALYDADCAAgEA-wIAIYQCAQD8AgAhiQJAAP4CACGcAkAA_gIAIaECAQD8AgAhsQIBAPsCACHJAgEA-wIAIcoCIAC3AwAhywIBAPwCACEDAAAAOgAgAQAATAAwJgAATQAgAwAAADoAIAEAADsAMAIAAAEAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQMAAL0FACCAAgEAAAABgQIBAAAAAYkCQAAAAAGcAkAAAAABvAJAAAAAAcYCAQAAAAHHAgEAAAAByAIBAAAAAQEaAABVACAIgAIBAAAAAYECAQAAAAGJAkAAAAABnAJAAAAAAbwCQAAAAAHGAgEAAAABxwIBAAAAAcgCAQAAAAEBGgAAVwAwARoAAFcAMAkDAAC8BQAggAIBANkDACGBAgEA2QMAIYkCQADcAwAhnAJAANwDACG8AkAA3AMAIcYCAQDZAwAhxwIBANoDACHIAgEA2gMAIQIAAAAFACAaAABaACAIgAIBANkDACGBAgEA2QMAIYkCQADcAwAhnAJAANwDACG8AkAA3AMAIcYCAQDZAwAhxwIBANoDACHIAgEA2gMAIQIAAAADACAaAABcACACAAAAAwAgGgAAXAAgAwAAAAUAICEAAFUAICIAAFoAIAEAAAAFACABAAAAAwAgBQgAALkFACAnAAC7BQAgKAAAugUAIMcCAADVAwAgyAIAANUDACAL_QEAALUDADD-AQAAYwAQ_wEAALUDADCAAgEA-wIAIYECAQD7AgAhiQJAAP4CACGcAkAA_gIAIbwCQAD-AgAhxgIBAPsCACHHAgEA_AIAIcgCAQD8AgAhAwAAAAMAIAEAAGIAMCYAAGMAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA4DAAC4BQAggAIBAAAAAYECAQAAAAGJAkAAAAABnAJAAAAAAb0CAQAAAAG-AgEAAAABvwIBAAAAAcACAQAAAAHBAgEAAAABwgJAAAAAAcMCQAAAAAHEAgEAAAABxQIBAAAAAQEaAABrACANgAIBAAAAAYECAQAAAAGJAkAAAAABnAJAAAAAAb0CAQAAAAG-AgEAAAABvwIBAAAAAcACAQAAAAHBAgEAAAABwgJAAAAAAcMCQAAAAAHEAgEAAAABxQIBAAAAAQEaAABtADABGgAAbQAwDgMAALcFACCAAgEA2QMAIYECAQDZAwAhiQJAANwDACGcAkAA3AMAIb0CAQDZAwAhvgIBANkDACG_AgEA2gMAIcACAQDaAwAhwQIBANoDACHCAkAA2wMAIcMCQADbAwAhxAIBANoDACHFAgEA2gMAIQIAAAAJACAaAABwACANgAIBANkDACGBAgEA2QMAIYkCQADcAwAhnAJAANwDACG9AgEA2QMAIb4CAQDZAwAhvwIBANoDACHAAgEA2gMAIcECAQDaAwAhwgJAANsDACHDAkAA2wMAIcQCAQDaAwAhxQIBANoDACECAAAABwAgGgAAcgAgAgAAAAcAIBoAAHIAIAMAAAAJACAhAABrACAiAABwACABAAAACQAgAQAAAAcAIAoIAAC0BQAgJwAAtgUAICgAALUFACC_AgAA1QMAIMACAADVAwAgwQIAANUDACDCAgAA1QMAIMMCAADVAwAgxAIAANUDACDFAgAA1QMAIBD9AQAAtAMAMP4BAAB5ABD_AQAAtAMAMIACAQD7AgAhgQIBAPsCACGJAkAA_gIAIZwCQAD-AgAhvQIBAPsCACG-AgEA-wIAIb8CAQD8AgAhwAIBAPwCACHBAgEA_AIAIcICQAD9AgAhwwJAAP0CACHEAgEA_AIAIcUCAQD8AgAhAwAAAAcAIAEAAHgAMCYAAHkAIAMAAAAHACABAAAIADACAAAJACAJ_QEAALMDADD-AQAAfwAQ_wEAALMDADCAAgEAAAABiQJAAI0DACGcAkAAjQMAIboCAQCKAwAhuwIBAIoDACG8AkAAjQMAIQEAAAB8ACABAAAAfAAgCf0BAACzAwAw_gEAAH8AEP8BAACzAwAwgAIBAIoDACGJAkAAjQMAIZwCQACNAwAhugIBAIoDACG7AgEAigMAIbwCQACNAwAhAAMAAAB_ACABAACAAQAwAgAAfAAgAwAAAH8AIAEAAIABADACAAB8ACADAAAAfwAgAQAAgAEAMAIAAHwAIAaAAgEAAAABiQJAAAAAAZwCQAAAAAG6AgEAAAABuwIBAAAAAbwCQAAAAAEBGgAAhAEAIAaAAgEAAAABiQJAAAAAAZwCQAAAAAG6AgEAAAABuwIBAAAAAbwCQAAAAAEBGgAAhgEAMAEaAACGAQAwBoACAQDZAwAhiQJAANwDACGcAkAA3AMAIboCAQDZAwAhuwIBANkDACG8AkAA3AMAIQIAAAB8ACAaAACJAQAgBoACAQDZAwAhiQJAANwDACGcAkAA3AMAIboCAQDZAwAhuwIBANkDACG8AkAA3AMAIQIAAAB_ACAaAACLAQAgAgAAAH8AIBoAAIsBACADAAAAfAAgIQAAhAEAICIAAIkBACABAAAAfAAgAQAAAH8AIAMIAACxBQAgJwAAswUAICgAALIFACAJ_QEAALIDADD-AQAAkgEAEP8BAACyAwAwgAIBAPsCACGJAkAA_gIAIZwCQAD-AgAhugIBAPsCACG7AgEA-wIAIbwCQAD-AgAhAwAAAH8AIAEAAJEBADAmAACSAQAgAwAAAH8AIAEAAIABADACAAB8ACABAAAAIQAgAQAAACEAIAMAAAAfACABAAAgADACAAAhACADAAAAHwAgAQAAIAAwAgAAIQAgAwAAAB8AIAEAACAAMAIAACEAIAgLAACwBQAgDwAA-gQAIIACAQAAAAGJAkAAAAABmgIBAAAAAZwCQAAAAAGsAgIAAAABuQIBAAAAAQEaAACaAQAgBoACAQAAAAGJAkAAAAABmgIBAAAAAZwCQAAAAAGsAgIAAAABuQIBAAAAAQEaAACcAQAwARoAAJwBADAICwAArwUAIA8AAO0EACCAAgEA2QMAIYkCQADcAwAhmgIBANkDACGcAkAA3AMAIawCAgDpAwAhuQIBANkDACECAAAAIQAgGgAAnwEAIAaAAgEA2QMAIYkCQADcAwAhmgIBANkDACGcAkAA3AMAIawCAgDpAwAhuQIBANkDACECAAAAHwAgGgAAoQEAIAIAAAAfACAaAAChAQAgAwAAACEAICEAAJoBACAiAACfAQAgAQAAACEAIAEAAAAfACAFCAAAqgUAICcAAK0FACAoAACsBQAgaQAAqwUAIGoAAK4FACAJ_QEAALEDADD-AQAAqAEAEP8BAACxAwAwgAIBAPsCACGJAkAA_gIAIZoCAQD7AgAhnAJAAP4CACGsAgIAkQMAIbkCAQD7AgAhAwAAAB8AIAEAAKcBADAmAACoAQAgAwAAAB8AIAEAACAAMAIAACEAIAEAAAAlACABAAAAJQAgAwAAACMAIAEAACQAMAIAACUAIAMAAAAjACABAAAkADACAAAlACADAAAAIwAgAQAAJAAwAgAAJQAgBwwAAPgEACAOAAD8AwAggAIBAAAAAZsCAQAAAAGqAgIAAAABqwICAAAAAbgCAQAAAAEBGgAAsAEAIAWAAgEAAAABmwIBAAAAAaoCAgAAAAGrAgIAAAABuAIBAAAAAQEaAACyAQAwARoAALIBADAHDAAA9gQAIA4AAPoDACCAAgEA2QMAIZsCAQDZAwAhqgICAOkDACGrAgIA6QMAIbgCAQDZAwAhAgAAACUAIBoAALUBACAFgAIBANkDACGbAgEA2QMAIaoCAgDpAwAhqwICAOkDACG4AgEA2QMAIQIAAAAjACAaAAC3AQAgAgAAACMAIBoAALcBACADAAAAJQAgIQAAsAEAICIAALUBACABAAAAJQAgAQAAACMAIAUIAAClBQAgJwAAqAUAICgAAKcFACBpAACmBQAgagAAqQUAIAj9AQAAsAMAMP4BAAC-AQAQ_wEAALADADCAAgEA-wIAIZsCAQD7AgAhqgICAJEDACGrAgIAkQMAIbgCAQD7AgAhAwAAACMAIAEAAL0BADAmAAC-AQAgAwAAACMAIAEAACQAMAIAACUAIAkHAACPAwAg_QEAAK8DADD-AQAAxAEAEP8BAACvAwAwgAIBAAAAAYkCQACNAwAhnAJAAI0DACGxAgEAAAABtwIBAIsDACEBAAAAwQEAIAEAAADBAQAgCQcAAI8DACD9AQAArwMAMP4BAADEAQAQ_wEAAK8DADCAAgEAigMAIYkCQACNAwAhnAJAAI0DACGxAgEAigMAIbcCAQCLAwAhAgcAAKEEACC3AgAA1QMAIAMAAADEAQAgAQAAxQEAMAIAAMEBACADAAAAxAEAIAEAAMUBADACAADBAQAgAwAAAMQBACABAADFAQAwAgAAwQEAIAYHAACkBQAggAIBAAAAAYkCQAAAAAGcAkAAAAABsQIBAAAAAbcCAQAAAAEBGgAAyQEAIAWAAgEAAAABiQJAAAAAAZwCQAAAAAGxAgEAAAABtwIBAAAAAQEaAADLAQAwARoAAMsBADAGBwAAmgUAIIACAQDZAwAhiQJAANwDACGcAkAA3AMAIbECAQDZAwAhtwIBANoDACECAAAAwQEAIBoAAM4BACAFgAIBANkDACGJAkAA3AMAIZwCQADcAwAhsQIBANkDACG3AgEA2gMAIQIAAADEAQAgGgAA0AEAIAIAAADEAQAgGgAA0AEAIAMAAADBAQAgIQAAyQEAICIAAM4BACABAAAAwQEAIAEAAADEAQAgBAgAAJcFACAnAACZBQAgKAAAmAUAILcCAADVAwAgCP0BAACuAwAw_gEAANcBABD_AQAArgMAMIACAQD7AgAhiQJAAP4CACGcAkAA_gIAIbECAQD7AgAhtwIBAPwCACEDAAAAxAEAIAEAANYBADAmAADXAQAgAwAAAMQBACABAADFAQAwAgAAwQEAIA8DAACOAwAgCgAAqwMAIA0AAKwDACAQAACtAwAg_QEAAKoDADD-AQAANQAQ_wEAAKoDADCAAgEAAAABgQIBAAAAAYQCAQCKAwAhhQIBAIsDACGGAkAAjAMAIYcCAQCLAwAhiAIBAIsDACGJAkAAjQMAIQEAAADaAQAgAQAAANoBACAIAwAAoAQAIAoAAJQFACANAACVBQAgEAAAlgUAIIUCAADVAwAghgIAANUDACCHAgAA1QMAIIgCAADVAwAgAwAAADUAIAEAAN0BADACAADaAQAgAwAAADUAIAEAAN0BADACAADaAQAgAwAAADUAIAEAAN0BADACAADaAQAgDAMAAJAFACAKAACRBQAgDQAAkgUAIBAAAJMFACCAAgEAAAABgQIBAAAAAYQCAQAAAAGFAgEAAAABhgJAAAAAAYcCAQAAAAGIAgEAAAABiQJAAAAAAQEaAADhAQAgCIACAQAAAAGBAgEAAAABhAIBAAAAAYUCAQAAAAGGAkAAAAABhwIBAAAAAYgCAQAAAAGJAkAAAAABARoAAOMBADABGgAA4wEAMAwDAADeBAAgCgAA3wQAIA0AAOAEACAQAADhBAAggAIBANkDACGBAgEA2QMAIYQCAQDZAwAhhQIBANoDACGGAkAA2wMAIYcCAQDaAwAhiAIBANoDACGJAkAA3AMAIQIAAADaAQAgGgAA5gEAIAiAAgEA2QMAIYECAQDZAwAhhAIBANkDACGFAgEA2gMAIYYCQADbAwAhhwIBANoDACGIAgEA2gMAIYkCQADcAwAhAgAAADUAIBoAAOgBACACAAAANQAgGgAA6AEAIAMAAADaAQAgIQAA4QEAICIAAOYBACABAAAA2gEAIAEAAAA1ACAHCAAA2wQAICcAAN0EACAoAADcBAAghQIAANUDACCGAgAA1QMAIIcCAADVAwAgiAIAANUDACAL_QEAAKkDADD-AQAA7wEAEP8BAACpAwAwgAIBAPsCACGBAgEA-wIAIYQCAQD7AgAhhQIBAPwCACGGAkAA_QIAIYcCAQD8AgAhiAIBAPwCACGJAkAA_gIAIQMAAAA1ACABAADuAQAwJgAA7wEAIAMAAAA1ACABAADdAQAwAgAA2gEAIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgDwYAANoEACAJAACaBAAgDQAAnAQAIBMAAJsEACAUAACdBAAggAIBAAAAAYkCQAAAAAGcAkAAAAABqwICAAAAAbECAQAAAAGyAgEAAAABswICAAAAAbQCAQAAAAG1AgEAAAABtgIBAAAAAQEaAAD3AQAgCoACAQAAAAGJAkAAAAABnAJAAAAAAasCAgAAAAGxAgEAAAABsgIBAAAAAbMCAgAAAAG0AgEAAAABtQIBAAAAAbYCAQAAAAEBGgAA-QEAMAEaAAD5AQAwDwYAANkEACAJAADrAwAgDQAA7QMAIBMAAOwDACAUAADuAwAggAIBANkDACGJAkAA3AMAIZwCQADcAwAhqwICAOkDACGxAgEA2QMAIbICAQDZAwAhswICAOkDACG0AgEA2gMAIbUCAQDZAwAhtgIBANkDACECAAAADwAgGgAA_AEAIAqAAgEA2QMAIYkCQADcAwAhnAJAANwDACGrAgIA6QMAIbECAQDZAwAhsgIBANkDACGzAgIA6QMAIbQCAQDaAwAhtQIBANkDACG2AgEA2QMAIQIAAAANACAaAAD-AQAgAgAAAA0AIBoAAP4BACADAAAADwAgIQAA9wEAICIAAPwBACABAAAADwAgAQAAAA0AIAYIAADUBAAgJwAA1wQAICgAANYEACBpAADVBAAgagAA2AQAILQCAADVAwAgDf0BAACoAwAw_gEAAIUCABD_AQAAqAMAMIACAQD7AgAhiQJAAP4CACGcAkAA_gIAIasCAgCRAwAhsQIBAPsCACGyAgEA-wIAIbMCAgCRAwAhtAIBAPwCACG1AgEA-wIAIbYCAQD7AgAhAwAAAA0AIAEAAIQCADAmAACFAgAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAZACABAAAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgCwsAANEEACAPAADSBAAgEQAA0wQAIIACAQAAAAGaAgEAAAABnAJAAAAAAaECAAAArgICrAICAAAAAa4CAAAAoQICrwIBAAAAAbACQAAAAAEBGgAAjQIAIAiAAgEAAAABmgIBAAAAAZwCQAAAAAGhAgAAAK4CAqwCAgAAAAGuAgAAAKECAq8CAQAAAAGwAkAAAAABARoAAI8CADABGgAAjwIAMAsLAADABAAgDwAAwQQAIBEAAMIEACCAAgEA2QMAIZoCAQDZAwAhnAJAANwDACGhAgAAvwSuAiKsAgIA6QMAIa4CAACvBKECIq8CAQDZAwAhsAJAANwDACECAAAAGQAgGgAAkgIAIAiAAgEA2QMAIZoCAQDZAwAhnAJAANwDACGhAgAAvwSuAiKsAgIA6QMAIa4CAACvBKECIq8CAQDZAwAhsAJAANwDACECAAAAFwAgGgAAlAIAIAIAAAAXACAaAACUAgAgAwAAABkAICEAAI0CACAiAACSAgAgAQAAABkAIAEAAAAXACAFCAAAugQAICcAAL0EACAoAAC8BAAgaQAAuwQAIGoAAL4EACAL_QEAAKQDADD-AQAAmwIAEP8BAACkAwAwgAIBAPsCACGaAgEA-wIAIZwCQAD-AgAhoQIAAKUDrgIirAICAJEDACGuAgAAlwOhAiKvAgEA-wIAIbACQAD-AgAhAwAAABcAIAEAAJoCADAmAACbAgAgAwAAABcAIAEAABgAMAIAABkAIAEAAAAVACABAAAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgBwwAALkEACASAACYBAAggAIBAAAAAZsCAQAAAAGjAgEAAAABqgICAAAAAasCAgAAAAEBGgAAowIAIAWAAgEAAAABmwIBAAAAAaMCAQAAAAGqAgIAAAABqwICAAAAAQEaAAClAgAwARoAAKUCADAHDAAAuAQAIBIAAJYEACCAAgEA2QMAIZsCAQDZAwAhowIBANkDACGqAgIA6QMAIasCAgDpAwAhAgAAABUAIBoAAKgCACAFgAIBANkDACGbAgEA2QMAIaMCAQDZAwAhqgICAOkDACGrAgIA6QMAIQIAAAATACAaAACqAgAgAgAAABMAIBoAAKoCACADAAAAFQAgIQAAowIAICIAAKgCACABAAAAFQAgAQAAABMAIAUIAACzBAAgJwAAtgQAICgAALUEACBpAAC0BAAgagAAtwQAIAj9AQAAowMAMP4BAACxAgAQ_wEAAKMDADCAAgEA-wIAIZsCAQD7AgAhowIBAPsCACGqAgIAkQMAIasCAgCRAwAhAwAAABMAIAEAALACADAmAACxAgAgAwAAABMAIAEAABQAMAIAABUAIA0KAACiAwAg_QEAAJ4DADD-AQAALAAQ_wEAAJ4DADCAAgEAAAABiQJAAI0DACGcAkAAjQMAIZ0CCACfAwAhngIBAAAAAZ8CAQAAAAGhAgAAoAOhAiKiAgAAoQMAIKMCAQAAAAEBAAAAtAIAIAEAAAC0AgAgAwoAALIEACCfAgAA1QMAIKICAADVAwAgAwAAACwAIAEAALcCADACAAC0AgAgAwAAACwAIAEAALcCADACAAC0AgAgAwAAACwAIAEAALcCADACAAC0AgAgCgoAALEEACCAAgEAAAABiQJAAAAAAZwCQAAAAAGdAggAAAABngIBAAAAAZ8CAQAAAAGhAgAAAKECAqICgAAAAAGjAgEAAAABARoAALsCACAJgAIBAAAAAYkCQAAAAAGcAkAAAAABnQIIAAAAAZ4CAQAAAAGfAgEAAAABoQIAAAChAgKiAoAAAAABowIBAAAAAQEaAAC9AgAwARoAAL0CADAKCgAAsAQAIIACAQDZAwAhiQJAANwDACGcAkAA3AMAIZ0CCACuBAAhngIBANkDACGfAgEA2gMAIaECAACvBKECIqICgAAAAAGjAgEA2QMAIQIAAAC0AgAgGgAAwAIAIAmAAgEA2QMAIYkCQADcAwAhnAJAANwDACGdAggArgQAIZ4CAQDZAwAhnwIBANoDACGhAgAArwShAiKiAoAAAAABowIBANkDACECAAAALAAgGgAAwgIAIAIAAAAsACAaAADCAgAgAwAAALQCACAhAAC7AgAgIgAAwAIAIAEAAAC0AgAgAQAAACwAIAcIAACpBAAgJwAArAQAICgAAKsEACBpAACqBAAgagAArQQAIJ8CAADVAwAgogIAANUDACAM_QEAAJQDADD-AQAAyQIAEP8BAACUAwAwgAIBAPsCACGJAkAA_gIAIZwCQAD-AgAhnQIIAJUDACGeAgEAlgMAIZ8CAQD8AgAhoQIAAJcDoQIiogIAAJgDACCjAgEA-wIAIQMAAAAsACABAADIAgAwJgAAyQIAIAMAAAAsACABAAC3AgAwAgAAtAIAIAEAAAAdACABAAAAHQAgAwAAABsAIAEAABwAMAIAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgCQsAAIoEACAMAACoBAAggAIBAAAAAYkCQAAAAAGYAgIAAAABmQIBAAAAAZoCAQAAAAGbAgEAAAABnAJAAAAAAQEaAADRAgAgB4ACAQAAAAGJAkAAAAABmAICAAAAAZkCAQAAAAGaAgEAAAABmwIBAAAAAZwCQAAAAAEBGgAA0wIAMAEaAADTAgAwCQsAAIgEACAMAACnBAAggAIBANkDACGJAkAA3AMAIZgCAgDpAwAhmQIBANoDACGaAgEA2QMAIZsCAQDZAwAhnAJAANwDACECAAAAHQAgGgAA1gIAIAeAAgEA2QMAIYkCQADcAwAhmAICAOkDACGZAgEA2gMAIZoCAQDZAwAhmwIBANkDACGcAkAA3AMAIQIAAAAbACAaAADYAgAgAgAAABsAIBoAANgCACADAAAAHQAgIQAA0QIAICIAANYCACABAAAAHQAgAQAAABsAIAYIAACiBAAgJwAApQQAICgAAKQEACBpAACjBAAgagAApgQAIJkCAADVAwAgCv0BAACQAwAw_gEAAN8CABD_AQAAkAMAMIACAQD7AgAhiQJAAP4CACGYAgIAkQMAIZkCAQD8AgAhmgIBAPsCACGbAgEA-wIAIZwCQAD-AgAhAwAAABsAIAEAAN4CADAmAADfAgAgAwAAABsAIAEAABwAMAIAAB0AIA8DAACOAwAgBwAAjwMAIP0BAACJAwAw_gEAAAsAEP8BAACJAwAwgAIBAAAAAYECAQAAAAGCAgEAigMAIYMCAQCKAwAhhAIBAIoDACGFAgEAiwMAIYYCQACMAwAhhwIBAIsDACGIAgEAiwMAIYkCQACNAwAhAQAAAOICACABAAAA4gIAIAYDAACgBAAgBwAAoQQAIIUCAADVAwAghgIAANUDACCHAgAA1QMAIIgCAADVAwAgAwAAAAsAIAEAAOUCADACAADiAgAgAwAAAAsAIAEAAOUCADACAADiAgAgAwAAAAsAIAEAAOUCADACAADiAgAgDAMAAJ4EACAHAACfBAAggAIBAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABhgJAAAAAAYcCAQAAAAGIAgEAAAABiQJAAAAAAQEaAADpAgAgCoACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABhQIBAAAAAYYCQAAAAAGHAgEAAAABiAIBAAAAAYkCQAAAAAEBGgAA6wIAMAEaAADrAgAwDAMAAN0DACAHAADeAwAggAIBANkDACGBAgEA2QMAIYICAQDZAwAhgwIBANkDACGEAgEA2QMAIYUCAQDaAwAhhgJAANsDACGHAgEA2gMAIYgCAQDaAwAhiQJAANwDACECAAAA4gIAIBoAAO4CACAKgAIBANkDACGBAgEA2QMAIYICAQDZAwAhgwIBANkDACGEAgEA2QMAIYUCAQDaAwAhhgJAANsDACGHAgEA2gMAIYgCAQDaAwAhiQJAANwDACECAAAACwAgGgAA8AIAIAIAAAALACAaAADwAgAgAwAAAOICACAhAADpAgAgIgAA7gIAIAEAAADiAgAgAQAAAAsAIAcIAADWAwAgJwAA2AMAICgAANcDACCFAgAA1QMAIIYCAADVAwAghwIAANUDACCIAgAA1QMAIA39AQAA-gIAMP4BAAD3AgAQ_wEAAPoCADCAAgEA-wIAIYECAQD7AgAhggIBAPsCACGDAgEA-wIAIYQCAQD7AgAhhQIBAPwCACGGAkAA_QIAIYcCAQD8AgAhiAIBAPwCACGJAkAA_gIAIQMAAAALACABAAD2AgAwJgAA9wIAIAMAAAALACABAADlAgAwAgAA4gIAIA39AQAA-gIAMP4BAAD3AgAQ_wEAAPoCADCAAgEA-wIAIYECAQD7AgAhggIBAPsCACGDAgEA-wIAIYQCAQD7AgAhhQIBAPwCACGGAkAA_QIAIYcCAQD8AgAhiAIBAPwCACGJAkAA_gIAIQ4IAACAAwAgJwAAiAMAICgAAIgDACCKAgEAAAABiwIBAAAABIwCAQAAAASNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAAAABkQIBAIcDACGSAgEAAAABkwIBAAAAAZQCAQAAAAEOCAAAgwMAICcAAIYDACAoAACGAwAgigIBAAAAAYsCAQAAAAWMAgEAAAAFjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAAAAAZECAQCFAwAhkgIBAAAAAZMCAQAAAAGUAgEAAAABCwgAAIMDACAnAACEAwAgKAAAhAMAIIoCQAAAAAGLAkAAAAAFjAJAAAAABY0CQAAAAAGOAkAAAAABjwJAAAAAAZACQAAAAAGRAkAAggMAIQsIAACAAwAgJwAAgQMAICgAAIEDACCKAkAAAAABiwJAAAAABIwCQAAAAASNAkAAAAABjgJAAAAAAY8CQAAAAAGQAkAAAAABkQJAAP8CACELCAAAgAMAICcAAIEDACAoAACBAwAgigJAAAAAAYsCQAAAAASMAkAAAAAEjQJAAAAAAY4CQAAAAAGPAkAAAAABkAJAAAAAAZECQAD_AgAhCIoCAgAAAAGLAgIAAAAEjAICAAAABI0CAgAAAAGOAgIAAAABjwICAAAAAZACAgAAAAGRAgIAgAMAIQiKAkAAAAABiwJAAAAABIwCQAAAAASNAkAAAAABjgJAAAAAAY8CQAAAAAGQAkAAAAABkQJAAIEDACELCAAAgwMAICcAAIQDACAoAACEAwAgigJAAAAAAYsCQAAAAAWMAkAAAAAFjQJAAAAAAY4CQAAAAAGPAkAAAAABkAJAAAAAAZECQACCAwAhCIoCAgAAAAGLAgIAAAAFjAICAAAABY0CAgAAAAGOAgIAAAABjwICAAAAAZACAgAAAAGRAgIAgwMAIQiKAkAAAAABiwJAAAAABYwCQAAAAAWNAkAAAAABjgJAAAAAAY8CQAAAAAGQAkAAAAABkQJAAIQDACEOCAAAgwMAICcAAIYDACAoAACGAwAgigIBAAAAAYsCAQAAAAWMAgEAAAAFjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAAAAAZECAQCFAwAhkgIBAAAAAZMCAQAAAAGUAgEAAAABC4oCAQAAAAGLAgEAAAAFjAIBAAAABY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQAAAAGRAgEAhgMAIZICAQAAAAGTAgEAAAABlAIBAAAAAQ4IAACAAwAgJwAAiAMAICgAAIgDACCKAgEAAAABiwIBAAAABIwCAQAAAASNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAAAABkQIBAIcDACGSAgEAAAABkwIBAAAAAZQCAQAAAAELigIBAAAAAYsCAQAAAASMAgEAAAAEjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAAAAAZECAQCIAwAhkgIBAAAAAZMCAQAAAAGUAgEAAAABDwMAAI4DACAHAACPAwAg_QEAAIkDADD-AQAACwAQ_wEAAIkDADCAAgEAigMAIYECAQCKAwAhggIBAIoDACGDAgEAigMAIYQCAQCKAwAhhQIBAIsDACGGAkAAjAMAIYcCAQCLAwAhiAIBAIsDACGJAkAAjQMAIQuKAgEAAAABiwIBAAAABIwCAQAAAASNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAAAABkQIBAIgDACGSAgEAAAABkwIBAAAAAZQCAQAAAAELigIBAAAAAYsCAQAAAAWMAgEAAAAFjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAAAAAZECAQCGAwAhkgIBAAAAAZMCAQAAAAGUAgEAAAABCIoCQAAAAAGLAkAAAAAFjAJAAAAABY0CQAAAAAGOAkAAAAABjwJAAAAAAZACQAAAAAGRAkAAhAMAIQiKAkAAAAABiwJAAAAABIwCQAAAAASNAkAAAAABjgJAAAAAAY8CQAAAAAGQAkAAAAABkQJAAIEDACESBAAAvAMAIAUAAL0DACAGAAC-AwAgCwAAvwMAIP0BAAC6AwAw_gEAADoAEP8BAAC6AwAwgAIBAIoDACGEAgEAiwMAIYkCQACNAwAhnAJAAI0DACGhAgEAiwMAIbECAQCKAwAhyQIBAIoDACHKAiAAuwMAIcsCAQCLAwAhzQIAADoAIM4CAAA6ACADlQIAAA0AIJYCAAANACCXAgAADQAgCv0BAACQAwAw_gEAAN8CABD_AQAAkAMAMIACAQD7AgAhiQJAAP4CACGYAgIAkQMAIZkCAQD8AgAhmgIBAPsCACGbAgEA-wIAIZwCQAD-AgAhDQgAAIADACAnAACAAwAgKAAAgAMAIGkAAJMDACBqAACAAwAgigICAAAAAYsCAgAAAASMAgIAAAAEjQICAAAAAY4CAgAAAAGPAgIAAAABkAICAAAAAZECAgCSAwAhDQgAAIADACAnAACAAwAgKAAAgAMAIGkAAJMDACBqAACAAwAgigICAAAAAYsCAgAAAASMAgIAAAAEjQICAAAAAY4CAgAAAAGPAgIAAAABkAICAAAAAZECAgCSAwAhCIoCCAAAAAGLAggAAAAEjAIIAAAABI0CCAAAAAGOAggAAAABjwIIAAAAAZACCAAAAAGRAggAkwMAIQz9AQAAlAMAMP4BAADJAgAQ_wEAAJQDADCAAgEA-wIAIYkCQAD-AgAhnAJAAP4CACGdAggAlQMAIZ4CAQCWAwAhnwIBAPwCACGhAgAAlwOhAiKiAgAAmAMAIKMCAQD7AgAhDQgAAIADACAnAACTAwAgKAAAkwMAIGkAAJMDACBqAACTAwAgigIIAAAAAYsCCAAAAASMAggAAAAEjQIIAAAAAY4CCAAAAAGPAggAAAABkAIIAAAAAZECCACdAwAhCwgAAIADACAnAACIAwAgKAAAiAMAIIoCAQAAAAGLAgEAAAAEjAIBAAAABI0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQAAAAGRAgEAnAMAIQcIAACAAwAgJwAAmwMAICgAAJsDACCKAgAAAKECAosCAAAAoQIIjAIAAAChAgiRAgAAmgOhAiIPCAAAgwMAICcAAJkDACAoAACZAwAgigKAAAAAAY0CgAAAAAGOAoAAAAABjwKAAAAAAZACgAAAAAGRAoAAAAABpAIBAAAAAaUCAQAAAAGmAgEAAAABpwKAAAAAAagCgAAAAAGpAoAAAAABDIoCgAAAAAGNAoAAAAABjgKAAAAAAY8CgAAAAAGQAoAAAAABkQKAAAAAAaQCAQAAAAGlAgEAAAABpgIBAAAAAacCgAAAAAGoAoAAAAABqQKAAAAAAQcIAACAAwAgJwAAmwMAICgAAJsDACCKAgAAAKECAosCAAAAoQIIjAIAAAChAgiRAgAAmgOhAiIEigIAAAChAgKLAgAAAKECCIwCAAAAoQIIkQIAAJsDoQIiCwgAAIADACAnAACIAwAgKAAAiAMAIIoCAQAAAAGLAgEAAAAEjAIBAAAABI0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQAAAAGRAgEAnAMAIQ0IAACAAwAgJwAAkwMAICgAAJMDACBpAACTAwAgagAAkwMAIIoCCAAAAAGLAggAAAAEjAIIAAAABI0CCAAAAAGOAggAAAABjwIIAAAAAZACCAAAAAGRAggAnQMAIQ0KAACiAwAg_QEAAJ4DADD-AQAALAAQ_wEAAJ4DADCAAgEAigMAIYkCQACNAwAhnAJAAI0DACGdAggAnwMAIZ4CAQDAAwAhnwIBAIsDACGhAgAAoAOhAiKiAgAAoQMAIKMCAQCKAwAhCIoCCAAAAAGLAggAAAAEjAIIAAAABI0CCAAAAAGOAggAAAABjwIIAAAAAZACCAAAAAGRAggAkwMAIQSKAgAAAKECAosCAAAAoQIIjAIAAAChAgiRAgAAmwOhAiIMigKAAAAAAY0CgAAAAAGOAoAAAAABjwKAAAAAAZACgAAAAAGRAoAAAAABpAIBAAAAAaUCAQAAAAGmAgEAAAABpwKAAAAAAagCgAAAAAGpAoAAAAABEAsAAMgDACAPAADNAwAgEQAAzgMAIP0BAADLAwAw_gEAABcAEP8BAADLAwAwgAIBAIoDACGaAgEAigMAIZwCQACNAwAhoQIAAMwDrgIirAICAMQDACGuAgAAoAOhAiKvAgEAigMAIbACQACNAwAhzQIAABcAIM4CAAAXACAI_QEAAKMDADD-AQAAsQIAEP8BAACjAwAwgAIBAPsCACGbAgEA-wIAIaMCAQD7AgAhqgICAJEDACGrAgIAkQMAIQv9AQAApAMAMP4BAACbAgAQ_wEAAKQDADCAAgEA-wIAIZoCAQD7AgAhnAJAAP4CACGhAgAApQOuAiKsAgIAkQMAIa4CAACXA6ECIq8CAQD7AgAhsAJAAP4CACEHCAAAgAMAICcAAKcDACAoAACnAwAgigIAAACuAgKLAgAAAK4CCIwCAAAArgIIkQIAAKYDrgIiBwgAAIADACAnAACnAwAgKAAApwMAIIoCAAAArgICiwIAAACuAgiMAgAAAK4CCJECAACmA64CIgSKAgAAAK4CAosCAAAArgIIjAIAAACuAgiRAgAApwOuAiIN_QEAAKgDADD-AQAAhQIAEP8BAACoAwAwgAIBAPsCACGJAkAA_gIAIZwCQAD-AgAhqwICAJEDACGxAgEA-wIAIbICAQD7AgAhswICAJEDACG0AgEA_AIAIbUCAQD7AgAhtgIBAPsCACEL_QEAAKkDADD-AQAA7wEAEP8BAACpAwAwgAIBAPsCACGBAgEA-wIAIYQCAQD7AgAhhQIBAPwCACGGAkAA_QIAIYcCAQD8AgAhiAIBAPwCACGJAkAA_gIAIQ8DAACOAwAgCgAAqwMAIA0AAKwDACAQAACtAwAg_QEAAKoDADD-AQAANQAQ_wEAAKoDADCAAgEAigMAIYECAQCKAwAhhAIBAIoDACGFAgEAiwMAIYYCQACMAwAhhwIBAIsDACGIAgEAiwMAIYkCQACNAwAhA5UCAAAXACCWAgAAFwAglwIAABcAIAOVAgAAGwAglgIAABsAIJcCAAAbACADlQIAAB8AIJYCAAAfACCXAgAAHwAgCP0BAACuAwAw_gEAANcBABD_AQAArgMAMIACAQD7AgAhiQJAAP4CACGcAkAA_gIAIbECAQD7AgAhtwIBAPwCACEJBwAAjwMAIP0BAACvAwAw_gEAAMQBABD_AQAArwMAMIACAQCKAwAhiQJAAI0DACGcAkAAjQMAIbECAQCKAwAhtwIBAIsDACEI_QEAALADADD-AQAAvgEAEP8BAACwAwAwgAIBAPsCACGbAgEA-wIAIaoCAgCRAwAhqwICAJEDACG4AgEA-wIAIQn9AQAAsQMAMP4BAACoAQAQ_wEAALEDADCAAgEA-wIAIYkCQAD-AgAhmgIBAPsCACGcAkAA_gIAIawCAgCRAwAhuQIBAPsCACEJ_QEAALIDADD-AQAAkgEAEP8BAACyAwAwgAIBAPsCACGJAkAA_gIAIZwCQAD-AgAhugIBAPsCACG7AgEA-wIAIbwCQAD-AgAhCf0BAACzAwAw_gEAAH8AEP8BAACzAwAwgAIBAIoDACGJAkAAjQMAIZwCQACNAwAhugIBAIoDACG7AgEAigMAIbwCQACNAwAhEP0BAAC0AwAw_gEAAHkAEP8BAAC0AwAwgAIBAPsCACGBAgEA-wIAIYkCQAD-AgAhnAJAAP4CACG9AgEA-wIAIb4CAQD7AgAhvwIBAPwCACHAAgEA_AIAIcECAQD8AgAhwgJAAP0CACHDAkAA_QIAIcQCAQD8AgAhxQIBAPwCACEL_QEAALUDADD-AQAAYwAQ_wEAALUDADCAAgEA-wIAIYECAQD7AgAhiQJAAP4CACGcAkAA_gIAIbwCQAD-AgAhxgIBAPsCACHHAgEA_AIAIcgCAQD8AgAhDP0BAAC2AwAw_gEAAE0AEP8BAAC2AwAwgAIBAPsCACGEAgEA_AIAIYkCQAD-AgAhnAJAAP4CACGhAgEA_AIAIbECAQD7AgAhyQIBAPsCACHKAiAAtwMAIcsCAQD8AgAhBQgAAIADACAnAAC5AwAgKAAAuQMAIIoCIAAAAAGRAiAAuAMAIQUIAACAAwAgJwAAuQMAICgAALkDACCKAiAAAAABkQIgALgDACECigIgAAAAAZECIAC5AwAhEAQAALwDACAFAAC9AwAgBgAAvgMAIAsAAL8DACD9AQAAugMAMP4BAAA6ABD_AQAAugMAMIACAQCKAwAhhAIBAIsDACGJAkAAjQMAIZwCQACNAwAhoQIBAIsDACGxAgEAigMAIckCAQCKAwAhygIgALsDACHLAgEAiwMAIQKKAiAAAAABkQIgALkDACEDlQIAAAMAIJYCAAADACCXAgAAAwAgA5UCAAAHACCWAgAABwAglwIAAAcAIBEDAACOAwAgBwAAjwMAIP0BAACJAwAw_gEAAAsAEP8BAACJAwAwgAIBAIoDACGBAgEAigMAIYICAQCKAwAhgwIBAIoDACGEAgEAigMAIYUCAQCLAwAhhgJAAIwDACGHAgEAiwMAIYgCAQCLAwAhiQJAAI0DACHNAgAACwAgzgIAAAsAIBEDAACOAwAgCgAAqwMAIA0AAKwDACAQAACtAwAg_QEAAKoDADD-AQAANQAQ_wEAAKoDADCAAgEAigMAIYECAQCKAwAhhAIBAIoDACGFAgEAiwMAIYYCQACMAwAhhwIBAIsDACGIAgEAiwMAIYkCQACNAwAhzQIAADUAIM4CAAA1ACAIigIBAAAAAYsCAQAAAASMAgEAAAAEjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAAAAAZECAQDBAwAhCIoCAQAAAAGLAgEAAAAEjAIBAAAABI0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQAAAAGRAgEAwQMAIQKbAgEAAAABuAIBAAAAAQoMAADGAwAgDgAAxQMAIP0BAADDAwAw_gEAACMAEP8BAADDAwAwgAIBAIoDACGbAgEAigMAIaoCAgDEAwAhqwICAMQDACG4AgEAigMAIQiKAgIAAAABiwICAAAABIwCAgAAAASNAgIAAAABjgICAAAAAY8CAgAAAAGQAgIAAAABkQICAIADACENCwAAyAMAIA8AAMkDACD9AQAAxwMAMP4BAAAfABD_AQAAxwMAMIACAQCKAwAhiQJAAI0DACGaAgEAigMAIZwCQACNAwAhrAICAMQDACG5AgEAigMAIc0CAAAfACDOAgAAHwAgFAYAANEDACAJAADSAwAgDQAArAMAIBMAAM0DACAUAADJAwAg_QEAANADADD-AQAADQAQ_wEAANADADCAAgEAigMAIYkCQACNAwAhnAJAAI0DACGrAgIAxAMAIbECAQCKAwAhsgIBAIoDACGzAgIAxAMAIbQCAQCLAwAhtQIBAIoDACG2AgEAigMAIc0CAAANACDOAgAADQAgCwsAAMgDACAPAADJAwAg_QEAAMcDADD-AQAAHwAQ_wEAAMcDADCAAgEAigMAIYkCQACNAwAhmgIBAIoDACGcAkAAjQMAIawCAgDEAwAhuQIBAIoDACERAwAAjgMAIAoAAKsDACANAACsAwAgEAAArQMAIP0BAACqAwAw_gEAADUAEP8BAACqAwAwgAIBAIoDACGBAgEAigMAIYQCAQCKAwAhhQIBAIsDACGGAkAAjAMAIYcCAQCLAwAhiAIBAIsDACGJAkAAjQMAIc0CAAA1ACDOAgAANQAgA5UCAAAjACCWAgAAIwAglwIAACMAIAwLAADIAwAgDAAAxgMAIP0BAADKAwAw_gEAABsAEP8BAADKAwAwgAIBAIoDACGJAkAAjQMAIZgCAgDEAwAhmQIBAIsDACGaAgEAigMAIZsCAQCKAwAhnAJAAI0DACEOCwAAyAMAIA8AAM0DACARAADOAwAg_QEAAMsDADD-AQAAFwAQ_wEAAMsDADCAAgEAigMAIZoCAQCKAwAhnAJAAI0DACGhAgAAzAOuAiKsAgIAxAMAIa4CAACgA6ECIq8CAQCKAwAhsAJAAI0DACEEigIAAACuAgKLAgAAAK4CCIwCAAAArgIIkQIAAKcDrgIiA5UCAAATACCWAgAAEwAglwIAABMAIA8KAACiAwAg_QEAAJ4DADD-AQAALAAQ_wEAAJ4DADCAAgEAigMAIYkCQACNAwAhnAJAAI0DACGdAggAnwMAIZ4CAQDAAwAhnwIBAIsDACGhAgAAoAOhAiKiAgAAoQMAIKMCAQCKAwAhzQIAACwAIM4CAAAsACAKDAAAxgMAIBIAAKIDACD9AQAAzwMAMP4BAAATABD_AQAAzwMAMIACAQCKAwAhmwIBAIoDACGjAgEAigMAIaoCAgDEAwAhqwICAMQDACESBgAA0QMAIAkAANIDACANAACsAwAgEwAAzQMAIBQAAMkDACD9AQAA0AMAMP4BAAANABD_AQAA0AMAMIACAQCKAwAhiQJAAI0DACGcAkAAjQMAIasCAgDEAwAhsQIBAIoDACGyAgEAigMAIbMCAgDEAwAhtAIBAIsDACG1AgEAigMAIbYCAQCKAwAhEQMAAI4DACAHAACPAwAg_QEAAIkDADD-AQAACwAQ_wEAAIkDADCAAgEAigMAIYECAQCKAwAhggIBAIoDACGDAgEAigMAIYQCAQCKAwAhhQIBAIsDACGGAkAAjAMAIYcCAQCLAwAhiAIBAIsDACGJAkAAjQMAIc0CAAALACDOAgAACwAgCwcAAI8DACD9AQAArwMAMP4BAADEAQAQ_wEAAK8DADCAAgEAigMAIYkCQACNAwAhnAJAAI0DACGxAgEAigMAIbcCAQCLAwAhzQIAAMQBACDOAgAAxAEAIBEDAACOAwAg_QEAANMDADD-AQAABwAQ_wEAANMDADCAAgEAigMAIYECAQCKAwAhiQJAAI0DACGcAkAAjQMAIb0CAQCKAwAhvgIBAIoDACG_AgEAiwMAIcACAQCLAwAhwQIBAIsDACHCAkAAjAMAIcMCQACMAwAhxAIBAIsDACHFAgEAiwMAIQwDAACOAwAg_QEAANQDADD-AQAAAwAQ_wEAANQDADCAAgEAigMAIYECAQCKAwAhiQJAAI0DACGcAkAAjQMAIbwCQACNAwAhxgIBAIoDACHHAgEAiwMAIcgCAQCLAwAhAAAAAAHSAgEAAAABAdICAQAAAAEB0gJAAAAAAQHSAkAAAAABBSEAALAGACAiAADLBgAgzwIAALEGACDQAgAAygYAINUCAAABACALIQAA3wMAMCIAAOQDADDPAgAA4AMAMNACAADhAwAw0QIAAOIDACDSAgAA4wMAMNMCAADjAwAw1AIAAOMDADDVAgAA4wMAMNYCAADlAwAw1wIAAOYDADANCQAAmgQAIA0AAJwEACATAACbBAAgFAAAnQQAIIACAQAAAAGJAkAAAAABnAJAAAAAAasCAgAAAAGxAgEAAAABsgIBAAAAAbMCAgAAAAG0AgEAAAABtgIBAAAAAQIAAAAPACAhAACZBAAgAwAAAA8AICEAAJkEACAiAADqAwAgARoAAMkGADASBgAA0QMAIAkAANIDACANAACsAwAgEwAAzQMAIBQAAMkDACD9AQAA0AMAMP4BAAANABD_AQAA0AMAMIACAQAAAAGJAkAAjQMAIZwCQACNAwAhqwICAMQDACGxAgEAigMAIbICAQCKAwAhswICAMQDACG0AgEAiwMAIbUCAQCKAwAhtgIBAIoDACECAAAADwAgGgAA6gMAIAIAAADnAwAgGgAA6AMAIA39AQAA5gMAMP4BAADnAwAQ_wEAAOYDADCAAgEAigMAIYkCQACNAwAhnAJAAI0DACGrAgIAxAMAIbECAQCKAwAhsgIBAIoDACGzAgIAxAMAIbQCAQCLAwAhtQIBAIoDACG2AgEAigMAIQ39AQAA5gMAMP4BAADnAwAQ_wEAAOYDADCAAgEAigMAIYkCQACNAwAhnAJAAI0DACGrAgIAxAMAIbECAQCKAwAhsgIBAIoDACGzAgIAxAMAIbQCAQCLAwAhtQIBAIoDACG2AgEAigMAIQmAAgEA2QMAIYkCQADcAwAhnAJAANwDACGrAgIA6QMAIbECAQDZAwAhsgIBANkDACGzAgIA6QMAIbQCAQDaAwAhtgIBANkDACEF0gICAAAAAdgCAgAAAAHZAgIAAAAB2gICAAAAAdsCAgAAAAENCQAA6wMAIA0AAO0DACATAADsAwAgFAAA7gMAIIACAQDZAwAhiQJAANwDACGcAkAA3AMAIasCAgDpAwAhsQIBANkDACGyAgEA2QMAIbMCAgDpAwAhtAIBANoDACG2AgEA2QMAIQUhAACyBgAgIgAAxwYAIM8CAACzBgAg0AIAAMYGACDVAgAAwQEAIAshAACLBAAwIgAAkAQAMM8CAACMBAAw0AIAAI0EADDRAgAAjgQAINICAACPBAAw0wIAAI8EADDUAgAAjwQAMNUCAACPBAAw1gIAAJEEADDXAgAAkgQAMAshAAD9AwAwIgAAggQAMM8CAAD-AwAw0AIAAP8DADDRAgAAgAQAINICAACBBAAw0wIAAIEEADDUAgAAgQQAMNUCAACBBAAw1gIAAIMEADDXAgAAhAQAMAshAADvAwAwIgAA9AMAMM8CAADwAwAw0AIAAPEDADDRAgAA8gMAINICAADzAwAw0wIAAPMDADDUAgAA8wMAMNUCAADzAwAw1gIAAPUDADDXAgAA9gMAMAUOAAD8AwAggAIBAAAAAaoCAgAAAAGrAgIAAAABuAIBAAAAAQIAAAAlACAhAAD7AwAgAwAAACUAICEAAPsDACAiAAD5AwAgARoAAMUGADALDAAAxgMAIA4AAMUDACD9AQAAwwMAMP4BAAAjABD_AQAAwwMAMIACAQAAAAGbAgEAigMAIaoCAgDEAwAhqwICAMQDACG4AgEAigMAIcwCAADCAwAgAgAAACUAIBoAAPkDACACAAAA9wMAIBoAAPgDACAI_QEAAPYDADD-AQAA9wMAEP8BAAD2AwAwgAIBAIoDACGbAgEAigMAIaoCAgDEAwAhqwICAMQDACG4AgEAigMAIQj9AQAA9gMAMP4BAAD3AwAQ_wEAAPYDADCAAgEAigMAIZsCAQCKAwAhqgICAMQDACGrAgIAxAMAIbgCAQCKAwAhBIACAQDZAwAhqgICAOkDACGrAgIA6QMAIbgCAQDZAwAhBQ4AAPoDACCAAgEA2QMAIaoCAgDpAwAhqwICAOkDACG4AgEA2QMAIQUhAADABgAgIgAAwwYAIM8CAADBBgAg0AIAAMIGACDVAgAAIQAgBQ4AAPwDACCAAgEAAAABqgICAAAAAasCAgAAAAG4AgEAAAABAyEAAMAGACDPAgAAwQYAINUCAAAhACAHCwAAigQAIIACAQAAAAGJAkAAAAABmAICAAAAAZkCAQAAAAGaAgEAAAABnAJAAAAAAQIAAAAdACAhAACJBAAgAwAAAB0AICEAAIkEACAiAACHBAAgARoAAL8GADAMCwAAyAMAIAwAAMYDACD9AQAAygMAMP4BAAAbABD_AQAAygMAMIACAQAAAAGJAkAAjQMAIZgCAgDEAwAhmQIBAIsDACGaAgEAigMAIZsCAQCKAwAhnAJAAI0DACECAAAAHQAgGgAAhwQAIAIAAACFBAAgGgAAhgQAIAr9AQAAhAQAMP4BAACFBAAQ_wEAAIQEADCAAgEAigMAIYkCQACNAwAhmAICAMQDACGZAgEAiwMAIZoCAQCKAwAhmwIBAIoDACGcAkAAjQMAIQr9AQAAhAQAMP4BAACFBAAQ_wEAAIQEADCAAgEAigMAIYkCQACNAwAhmAICAMQDACGZAgEAiwMAIZoCAQCKAwAhmwIBAIoDACGcAkAAjQMAIQaAAgEA2QMAIYkCQADcAwAhmAICAOkDACGZAgEA2gMAIZoCAQDZAwAhnAJAANwDACEHCwAAiAQAIIACAQDZAwAhiQJAANwDACGYAgIA6QMAIZkCAQDaAwAhmgIBANkDACGcAkAA3AMAIQUhAAC6BgAgIgAAvQYAIM8CAAC7BgAg0AIAALwGACDVAgAA2gEAIAcLAACKBAAggAIBAAAAAYkCQAAAAAGYAgIAAAABmQIBAAAAAZoCAQAAAAGcAkAAAAABAyEAALoGACDPAgAAuwYAINUCAADaAQAgBRIAAJgEACCAAgEAAAABowIBAAAAAaoCAgAAAAGrAgIAAAABAgAAABUAICEAAJcEACADAAAAFQAgIQAAlwQAICIAAJUEACABGgAAuQYAMAoMAADGAwAgEgAAogMAIP0BAADPAwAw_gEAABMAEP8BAADPAwAwgAIBAAAAAZsCAQCKAwAhowIBAIoDACGqAgIAxAMAIasCAgDEAwAhAgAAABUAIBoAAJUEACACAAAAkwQAIBoAAJQEACAI_QEAAJIEADD-AQAAkwQAEP8BAACSBAAwgAIBAIoDACGbAgEAigMAIaMCAQCKAwAhqgICAMQDACGrAgIAxAMAIQj9AQAAkgQAMP4BAACTBAAQ_wEAAJIEADCAAgEAigMAIZsCAQCKAwAhowIBAIoDACGqAgIAxAMAIasCAgDEAwAhBIACAQDZAwAhowIBANkDACGqAgIA6QMAIasCAgDpAwAhBRIAAJYEACCAAgEA2QMAIaMCAQDZAwAhqgICAOkDACGrAgIA6QMAIQUhAAC0BgAgIgAAtwYAIM8CAAC1BgAg0AIAALYGACDVAgAAGQAgBRIAAJgEACCAAgEAAAABowIBAAAAAaoCAgAAAAGrAgIAAAABAyEAALQGACDPAgAAtQYAINUCAAAZACANCQAAmgQAIA0AAJwEACATAACbBAAgFAAAnQQAIIACAQAAAAGJAkAAAAABnAJAAAAAAasCAgAAAAGxAgEAAAABsgIBAAAAAbMCAgAAAAG0AgEAAAABtgIBAAAAAQMhAACyBgAgzwIAALMGACDVAgAAwQEAIAQhAACLBAAwzwIAAIwEADDRAgAAjgQAINUCAACPBAAwBCEAAP0DADDPAgAA_gMAMNECAACABAAg1QIAAIEEADAEIQAA7wMAMM8CAADwAwAw0QIAAPIDACDVAgAA8wMAMAMhAACwBgAgzwIAALEGACDVAgAAAQAgBCEAAN8DADDPAgAA4AMAMNECAADiAwAg1QIAAOMDADAHBAAA7AUAIAUAAO0FACAGAADuBQAgCwAA7wUAIIQCAADVAwAgoQIAANUDACDLAgAA1QMAIAAAAAAAAAUhAACrBgAgIgAArgYAIM8CAACsBgAg0AIAAK0GACDVAgAADwAgAyEAAKsGACDPAgAArAYAINUCAAAPACAAAAAAAAXSAggAAAAB2AIIAAAAAdkCCAAAAAHaAggAAAAB2wIIAAAAAQHSAgAAAKECAgUhAACmBgAgIgAAqQYAIM8CAACnBgAg0AIAAKgGACDVAgAAGQAgAyEAAKYGACDPAgAApwYAINUCAAAZACADCwAA7wUAIA8AAPMFACARAAD0BQAgAAAAAAAFIQAAoQYAICIAAKQGACDPAgAAogYAINACAACjBgAg1QIAAA8AIAMhAAChBgAgzwIAAKIGACDVAgAADwAgAAAAAAAB0gIAAACuAgIFIQAAmwYAICIAAJ8GACDPAgAAnAYAINACAACeBgAg1QIAANoBACALIQAAyAQAMCIAAMwEADDPAgAAyQQAMNACAADKBAAw0QIAAMsEACDSAgAAjwQAMNMCAACPBAAw1AIAAI8EADDVAgAAjwQAMNYCAADNBAAw1wIAAJIEADAHIQAAwwQAICIAAMYEACDPAgAAxAQAINACAADFBAAg0wIAACwAINQCAAAsACDVAgAAtAIAIAiAAgEAAAABiQJAAAAAAZwCQAAAAAGdAggAAAABngIBAAAAAZ8CAQAAAAGhAgAAAKECAqICgAAAAAECAAAAtAIAICEAAMMEACADAAAALAAgIQAAwwQAICIAAMcEACAKAAAALAAgGgAAxwQAIIACAQDZAwAhiQJAANwDACGcAkAA3AMAIZ0CCACuBAAhngIBANkDACGfAgEA2gMAIaECAACvBKECIqICgAAAAAEIgAIBANkDACGJAkAA3AMAIZwCQADcAwAhnQIIAK4EACGeAgEA2QMAIZ8CAQDaAwAhoQIAAK8EoQIiogKAAAAAAQUMAAC5BAAggAIBAAAAAZsCAQAAAAGqAgIAAAABqwICAAAAAQIAAAAVACAhAADQBAAgAwAAABUAICEAANAEACAiAADPBAAgARoAAJ0GADACAAAAFQAgGgAAzwQAIAIAAACTBAAgGgAAzgQAIASAAgEA2QMAIZsCAQDZAwAhqgICAOkDACGrAgIA6QMAIQUMAAC4BAAggAIBANkDACGbAgEA2QMAIaoCAgDpAwAhqwICAOkDACEFDAAAuQQAIIACAQAAAAGbAgEAAAABqgICAAAAAasCAgAAAAEDIQAAmwYAIM8CAACcBgAg1QIAANoBACAEIQAAyAQAMM8CAADJBAAw0QIAAMsEACDVAgAAjwQAMAMhAADDBAAgzwIAAMQEACDVAgAAtAIAIAAAAAAABSEAAJYGACAiAACZBgAgzwIAAJcGACDQAgAAmAYAINUCAADiAgAgAyEAAJYGACDPAgAAlwYAINUCAADiAgAgAAAABSEAAIgGACAiAACUBgAgzwIAAIkGACDQAgAAkwYAINUCAAABACALIQAAhAUAMCIAAIkFADDPAgAAhQUAMNACAACGBQAw0QIAAIcFACDSAgAAiAUAMNMCAACIBQAw1AIAAIgFADDVAgAAiAUAMNYCAACKBQAw1wIAAIsFADALIQAA-wQAMCIAAP8EADDPAgAA_AQAMNACAAD9BAAw0QIAAP4EACDSAgAAgQQAMNMCAACBBAAw1AIAAIEEADDVAgAAgQQAMNYCAACABQAw1wIAAIQEADALIQAA4gQAMCIAAOcEADDPAgAA4wQAMNACAADkBAAw0QIAAOUEACDSAgAA5gQAMNMCAADmBAAw1AIAAOYEADDVAgAA5gQAMNYCAADoBAAw1wIAAOkEADAGDwAA-gQAIIACAQAAAAGJAkAAAAABnAJAAAAAAawCAgAAAAG5AgEAAAABAgAAACEAICEAAPkEACADAAAAIQAgIQAA-QQAICIAAOwEACABGgAAkgYAMAsLAADIAwAgDwAAyQMAIP0BAADHAwAw_gEAAB8AEP8BAADHAwAwgAIBAAAAAYkCQACNAwAhmgIBAAAAAZwCQACNAwAhrAICAMQDACG5AgEAigMAIQIAAAAhACAaAADsBAAgAgAAAOoEACAaAADrBAAgCf0BAADpBAAw_gEAAOoEABD_AQAA6QQAMIACAQCKAwAhiQJAAI0DACGaAgEAigMAIZwCQACNAwAhrAICAMQDACG5AgEAigMAIQn9AQAA6QQAMP4BAADqBAAQ_wEAAOkEADCAAgEAigMAIYkCQACNAwAhmgIBAIoDACGcAkAAjQMAIawCAgDEAwAhuQIBAIoDACEFgAIBANkDACGJAkAA3AMAIZwCQADcAwAhrAICAOkDACG5AgEA2QMAIQYPAADtBAAggAIBANkDACGJAkAA3AMAIZwCQADcAwAhrAICAOkDACG5AgEA2QMAIQshAADuBAAwIgAA8gQAMM8CAADvBAAw0AIAAPAEADDRAgAA8QQAINICAADzAwAw0wIAAPMDADDUAgAA8wMAMNUCAADzAwAw1gIAAPMEADDXAgAA9gMAMAUMAAD4BAAggAIBAAAAAZsCAQAAAAGqAgIAAAABqwICAAAAAQIAAAAlACAhAAD3BAAgAwAAACUAICEAAPcEACAiAAD1BAAgARoAAJEGADACAAAAJQAgGgAA9QQAIAIAAAD3AwAgGgAA9AQAIASAAgEA2QMAIZsCAQDZAwAhqgICAOkDACGrAgIA6QMAIQUMAAD2BAAggAIBANkDACGbAgEA2QMAIaoCAgDpAwAhqwICAOkDACEFIQAAjAYAICIAAI8GACDPAgAAjQYAINACAACOBgAg1QIAAA8AIAUMAAD4BAAggAIBAAAAAZsCAQAAAAGqAgIAAAABqwICAAAAAQMhAACMBgAgzwIAAI0GACDVAgAADwAgBg8AAPoEACCAAgEAAAABiQJAAAAAAZwCQAAAAAGsAgIAAAABuQIBAAAAAQQhAADuBAAwzwIAAO8EADDRAgAA8QQAINUCAADzAwAwBwwAAKgEACCAAgEAAAABiQJAAAAAAZgCAgAAAAGZAgEAAAABmwIBAAAAAZwCQAAAAAECAAAAHQAgIQAAgwUAIAMAAAAdACAhAACDBQAgIgAAggUAIAEaAACLBgAwAgAAAB0AIBoAAIIFACACAAAAhQQAIBoAAIEFACAGgAIBANkDACGJAkAA3AMAIZgCAgDpAwAhmQIBANoDACGbAgEA2QMAIZwCQADcAwAhBwwAAKcEACCAAgEA2QMAIYkCQADcAwAhmAICAOkDACGZAgEA2gMAIZsCAQDZAwAhnAJAANwDACEHDAAAqAQAIIACAQAAAAGJAkAAAAABmAICAAAAAZkCAQAAAAGbAgEAAAABnAJAAAAAAQkPAADSBAAgEQAA0wQAIIACAQAAAAGcAkAAAAABoQIAAACuAgKsAgIAAAABrgIAAAChAgKvAgEAAAABsAJAAAAAAQIAAAAZACAhAACPBQAgAwAAABkAICEAAI8FACAiAACOBQAgARoAAIoGADAOCwAAyAMAIA8AAM0DACARAADOAwAg_QEAAMsDADD-AQAAFwAQ_wEAAMsDADCAAgEAAAABmgIBAIoDACGcAkAAjQMAIaECAADMA64CIqwCAgDEAwAhrgIAAKADoQIirwIBAIoDACGwAkAAjQMAIQIAAAAZACAaAACOBQAgAgAAAIwFACAaAACNBQAgC_0BAACLBQAw_gEAAIwFABD_AQAAiwUAMIACAQCKAwAhmgIBAIoDACGcAkAAjQMAIaECAADMA64CIqwCAgDEAwAhrgIAAKADoQIirwIBAIoDACGwAkAAjQMAIQv9AQAAiwUAMP4BAACMBQAQ_wEAAIsFADCAAgEAigMAIZoCAQCKAwAhnAJAAI0DACGhAgAAzAOuAiKsAgIAxAMAIa4CAACgA6ECIq8CAQCKAwAhsAJAAI0DACEHgAIBANkDACGcAkAA3AMAIaECAAC_BK4CIqwCAgDpAwAhrgIAAK8EoQIirwIBANkDACGwAkAA3AMAIQkPAADBBAAgEQAAwgQAIIACAQDZAwAhnAJAANwDACGhAgAAvwSuAiKsAgIA6QMAIa4CAACvBKECIq8CAQDZAwAhsAJAANwDACEJDwAA0gQAIBEAANMEACCAAgEAAAABnAJAAAAAAaECAAAArgICrAICAAAAAa4CAAAAoQICrwIBAAAAAbACQAAAAAEDIQAAiAYAIM8CAACJBgAg1QIAAAEAIAQhAACEBQAwzwIAAIUFADDRAgAAhwUAINUCAACIBQAwBCEAAPsEADDPAgAA_AQAMNECAAD-BAAg1QIAAIEEADAEIQAA4gQAMM8CAADjBAAw0QIAAOUEACDVAgAA5gQAMAAAAAAAAAshAACbBQAwIgAAnwUAMM8CAACcBQAw0AIAAJ0FADDRAgAAngUAINICAADjAwAw0wIAAOMDADDUAgAA4wMAMNUCAADjAwAw1gIAAKAFADDXAgAA5gMAMA0GAADaBAAgDQAAnAQAIBMAAJsEACAUAACdBAAggAIBAAAAAYkCQAAAAAGcAkAAAAABqwICAAAAAbECAQAAAAGyAgEAAAABswICAAAAAbQCAQAAAAG1AgEAAAABAgAAAA8AICEAAKMFACADAAAADwAgIQAAowUAICIAAKIFACABGgAAhwYAMAIAAAAPACAaAACiBQAgAgAAAOcDACAaAAChBQAgCYACAQDZAwAhiQJAANwDACGcAkAA3AMAIasCAgDpAwAhsQIBANkDACGyAgEA2QMAIbMCAgDpAwAhtAIBANoDACG1AgEA2QMAIQ0GAADZBAAgDQAA7QMAIBMAAOwDACAUAADuAwAggAIBANkDACGJAkAA3AMAIZwCQADcAwAhqwICAOkDACGxAgEA2QMAIbICAQDZAwAhswICAOkDACG0AgEA2gMAIbUCAQDZAwAhDQYAANoEACANAACcBAAgEwAAmwQAIBQAAJ0EACCAAgEAAAABiQJAAAAAAZwCQAAAAAGrAgIAAAABsQIBAAAAAbICAQAAAAGzAgIAAAABtAIBAAAAAbUCAQAAAAEEIQAAmwUAMM8CAACcBQAw0QIAAJ4FACDVAgAA4wMAMAAAAAAAAAAAAAAFIQAAggYAICIAAIUGACDPAgAAgwYAINACAACEBgAg1QIAANoBACADIQAAggYAIM8CAACDBgAg1QIAANoBACAAAAAAAAAFIQAA_QUAICIAAIAGACDPAgAA_gUAINACAAD_BQAg1QIAAAEAIAMhAAD9BQAgzwIAAP4FACDVAgAAAQAgAAAABSEAAPgFACAiAAD7BQAgzwIAAPkFACDQAgAA-gUAINUCAAABACADIQAA-AUAIM8CAAD5BQAg1QIAAAEAIAAAAAHSAiAAAAABCyEAANwFADAiAADhBQAwzwIAAN0FADDQAgAA3gUAMNECAADfBQAg0gIAAOAFADDTAgAA4AUAMNQCAADgBQAw1QIAAOAFADDWAgAA4gUAMNcCAADjBQAwCyEAANAFADAiAADVBQAwzwIAANEFADDQAgAA0gUAMNECAADTBQAg0gIAANQFADDTAgAA1AUAMNQCAADUBQAw1QIAANQFADDWAgAA1gUAMNcCAADXBQAwByEAAMsFACAiAADOBQAgzwIAAMwFACDQAgAAzQUAINMCAAALACDUAgAACwAg1QIAAOICACAHIQAAxgUAICIAAMkFACDPAgAAxwUAINACAADIBQAg0wIAADUAINQCAAA1ACDVAgAA2gEAIAoKAACRBQAgDQAAkgUAIBAAAJMFACCAAgEAAAABhAIBAAAAAYUCAQAAAAGGAkAAAAABhwIBAAAAAYgCAQAAAAGJAkAAAAABAgAAANoBACAhAADGBQAgAwAAADUAICEAAMYFACAiAADKBQAgDAAAADUAIAoAAN8EACANAADgBAAgEAAA4QQAIBoAAMoFACCAAgEA2QMAIYQCAQDZAwAhhQIBANoDACGGAkAA2wMAIYcCAQDaAwAhiAIBANoDACGJAkAA3AMAIQoKAADfBAAgDQAA4AQAIBAAAOEEACCAAgEA2QMAIYQCAQDZAwAhhQIBANoDACGGAkAA2wMAIYcCAQDaAwAhiAIBANoDACGJAkAA3AMAIQoHAACfBAAggAIBAAAAAYICAQAAAAGDAgEAAAABhAIBAAAAAYUCAQAAAAGGAkAAAAABhwIBAAAAAYgCAQAAAAGJAkAAAAABAgAAAOICACAhAADLBQAgAwAAAAsAICEAAMsFACAiAADPBQAgDAAAAAsAIAcAAN4DACAaAADPBQAggAIBANkDACGCAgEA2QMAIYMCAQDZAwAhhAIBANkDACGFAgEA2gMAIYYCQADbAwAhhwIBANoDACGIAgEA2gMAIYkCQADcAwAhCgcAAN4DACCAAgEA2QMAIYICAQDZAwAhgwIBANkDACGEAgEA2QMAIYUCAQDaAwAhhgJAANsDACGHAgEA2gMAIYgCAQDaAwAhiQJAANwDACEMgAIBAAAAAYkCQAAAAAGcAkAAAAABvQIBAAAAAb4CAQAAAAG_AgEAAAABwAIBAAAAAcECAQAAAAHCAkAAAAABwwJAAAAAAcQCAQAAAAHFAgEAAAABAgAAAAkAICEAANsFACADAAAACQAgIQAA2wUAICIAANoFACABGgAA9wUAMBEDAACOAwAg_QEAANMDADD-AQAABwAQ_wEAANMDADCAAgEAAAABgQIBAIoDACGJAkAAjQMAIZwCQACNAwAhvQIBAIoDACG-AgEAigMAIb8CAQCLAwAhwAIBAIsDACHBAgEAiwMAIcICQACMAwAhwwJAAIwDACHEAgEAiwMAIcUCAQCLAwAhAgAAAAkAIBoAANoFACACAAAA2AUAIBoAANkFACAQ_QEAANcFADD-AQAA2AUAEP8BAADXBQAwgAIBAIoDACGBAgEAigMAIYkCQACNAwAhnAJAAI0DACG9AgEAigMAIb4CAQCKAwAhvwIBAIsDACHAAgEAiwMAIcECAQCLAwAhwgJAAIwDACHDAkAAjAMAIcQCAQCLAwAhxQIBAIsDACEQ_QEAANcFADD-AQAA2AUAEP8BAADXBQAwgAIBAIoDACGBAgEAigMAIYkCQACNAwAhnAJAAI0DACG9AgEAigMAIb4CAQCKAwAhvwIBAIsDACHAAgEAiwMAIcECAQCLAwAhwgJAAIwDACHDAkAAjAMAIcQCAQCLAwAhxQIBAIsDACEMgAIBANkDACGJAkAA3AMAIZwCQADcAwAhvQIBANkDACG-AgEA2QMAIb8CAQDaAwAhwAIBANoDACHBAgEA2gMAIcICQADbAwAhwwJAANsDACHEAgEA2gMAIcUCAQDaAwAhDIACAQDZAwAhiQJAANwDACGcAkAA3AMAIb0CAQDZAwAhvgIBANkDACG_AgEA2gMAIcACAQDaAwAhwQIBANoDACHCAkAA2wMAIcMCQADbAwAhxAIBANoDACHFAgEA2gMAIQyAAgEAAAABiQJAAAAAAZwCQAAAAAG9AgEAAAABvgIBAAAAAb8CAQAAAAHAAgEAAAABwQIBAAAAAcICQAAAAAHDAkAAAAABxAIBAAAAAcUCAQAAAAEHgAIBAAAAAYkCQAAAAAGcAkAAAAABvAJAAAAAAcYCAQAAAAHHAgEAAAAByAIBAAAAAQIAAAAFACAhAADnBQAgAwAAAAUAICEAAOcFACAiAADmBQAgARoAAPYFADAMAwAAjgMAIP0BAADUAwAw_gEAAAMAEP8BAADUAwAwgAIBAAAAAYECAQCKAwAhiQJAAI0DACGcAkAAjQMAIbwCQACNAwAhxgIBAAAAAccCAQCLAwAhyAIBAIsDACECAAAABQAgGgAA5gUAIAIAAADkBQAgGgAA5QUAIAv9AQAA4wUAMP4BAADkBQAQ_wEAAOMFADCAAgEAigMAIYECAQCKAwAhiQJAAI0DACGcAkAAjQMAIbwCQACNAwAhxgIBAIoDACHHAgEAiwMAIcgCAQCLAwAhC_0BAADjBQAw_gEAAOQFABD_AQAA4wUAMIACAQCKAwAhgQIBAIoDACGJAkAAjQMAIZwCQACNAwAhvAJAAI0DACHGAgEAigMAIccCAQCLAwAhyAIBAIsDACEHgAIBANkDACGJAkAA3AMAIZwCQADcAwAhvAJAANwDACHGAgEA2QMAIccCAQDaAwAhyAIBANoDACEHgAIBANkDACGJAkAA3AMAIZwCQADcAwAhvAJAANwDACHGAgEA2QMAIccCAQDaAwAhyAIBANoDACEHgAIBAAAAAYkCQAAAAAGcAkAAAAABvAJAAAAAAcYCAQAAAAHHAgEAAAAByAIBAAAAAQQhAADcBQAwzwIAAN0FADDRAgAA3wUAINUCAADgBQAwBCEAANAFADDPAgAA0QUAMNECAADTBQAg1QIAANQFADADIQAAywUAIM8CAADMBQAg1QIAAOICACADIQAAxgUAIM8CAADHBQAg1QIAANoBACAAAAYDAACgBAAgBwAAoQQAIIUCAADVAwAghgIAANUDACCHAgAA1QMAIIgCAADVAwAgCAMAAKAEACAKAACUBQAgDQAAlQUAIBAAAJYFACCFAgAA1QMAIIYCAADVAwAghwIAANUDACCIAgAA1QMAIAILAADvBQAgDwAA8gUAIAYGAADuBQAgCQAA9QUAIA0AAJUFACATAADzBQAgFAAA8gUAILQCAADVAwAgAAADCgAAsgQAIJ8CAADVAwAgogIAANUDACACBwAAoQQAILcCAADVAwAgB4ACAQAAAAGJAkAAAAABnAJAAAAAAbwCQAAAAAHGAgEAAAABxwIBAAAAAcgCAQAAAAEMgAIBAAAAAYkCQAAAAAGcAkAAAAABvQIBAAAAAb4CAQAAAAG_AgEAAAABwAIBAAAAAcECAQAAAAHCAkAAAAABwwJAAAAAAcQCAQAAAAHFAgEAAAABDAUAAOkFACAGAADqBQAgCwAA6wUAIIACAQAAAAGEAgEAAAABiQJAAAAAAZwCQAAAAAGhAgEAAAABsQIBAAAAAckCAQAAAAHKAiAAAAABywIBAAAAAQIAAAABACAhAAD4BQAgAwAAADoAICEAAPgFACAiAAD8BQAgDgAAADoAIAUAAMMFACAGAADEBQAgCwAAxQUAIBoAAPwFACCAAgEA2QMAIYQCAQDaAwAhiQJAANwDACGcAkAA3AMAIaECAQDaAwAhsQIBANkDACHJAgEA2QMAIcoCIADBBQAhywIBANoDACEMBQAAwwUAIAYAAMQFACALAADFBQAggAIBANkDACGEAgEA2gMAIYkCQADcAwAhnAJAANwDACGhAgEA2gMAIbECAQDZAwAhyQIBANkDACHKAiAAwQUAIcsCAQDaAwAhDAQAAOgFACAGAADqBQAgCwAA6wUAIIACAQAAAAGEAgEAAAABiQJAAAAAAZwCQAAAAAGhAgEAAAABsQIBAAAAAckCAQAAAAHKAiAAAAABywIBAAAAAQIAAAABACAhAAD9BQAgAwAAADoAICEAAP0FACAiAACBBgAgDgAAADoAIAQAAMIFACAGAADEBQAgCwAAxQUAIBoAAIEGACCAAgEA2QMAIYQCAQDaAwAhiQJAANwDACGcAkAA3AMAIaECAQDaAwAhsQIBANkDACHJAgEA2QMAIcoCIADBBQAhywIBANoDACEMBAAAwgUAIAYAAMQFACALAADFBQAggAIBANkDACGEAgEA2gMAIYkCQADcAwAhnAJAANwDACGhAgEA2gMAIbECAQDZAwAhyQIBANkDACHKAiAAwQUAIcsCAQDaAwAhCwMAAJAFACAKAACRBQAgDQAAkgUAIIACAQAAAAGBAgEAAAABhAIBAAAAAYUCAQAAAAGGAkAAAAABhwIBAAAAAYgCAQAAAAGJAkAAAAABAgAAANoBACAhAACCBgAgAwAAADUAICEAAIIGACAiAACGBgAgDQAAADUAIAMAAN4EACAKAADfBAAgDQAA4AQAIBoAAIYGACCAAgEA2QMAIYECAQDZAwAhhAIBANkDACGFAgEA2gMAIYYCQADbAwAhhwIBANoDACGIAgEA2gMAIYkCQADcAwAhCwMAAN4EACAKAADfBAAgDQAA4AQAIIACAQDZAwAhgQIBANkDACGEAgEA2QMAIYUCAQDaAwAhhgJAANsDACGHAgEA2gMAIYgCAQDaAwAhiQJAANwDACEJgAIBAAAAAYkCQAAAAAGcAkAAAAABqwICAAAAAbECAQAAAAGyAgEAAAABswICAAAAAbQCAQAAAAG1AgEAAAABDAQAAOgFACAFAADpBQAgBgAA6gUAIIACAQAAAAGEAgEAAAABiQJAAAAAAZwCQAAAAAGhAgEAAAABsQIBAAAAAckCAQAAAAHKAiAAAAABywIBAAAAAQIAAAABACAhAACIBgAgB4ACAQAAAAGcAkAAAAABoQIAAACuAgKsAgIAAAABrgIAAAChAgKvAgEAAAABsAJAAAAAAQaAAgEAAAABiQJAAAAAAZgCAgAAAAGZAgEAAAABmwIBAAAAAZwCQAAAAAEOBgAA2gQAIAkAAJoEACANAACcBAAgEwAAmwQAIIACAQAAAAGJAkAAAAABnAJAAAAAAasCAgAAAAGxAgEAAAABsgIBAAAAAbMCAgAAAAG0AgEAAAABtQIBAAAAAbYCAQAAAAECAAAADwAgIQAAjAYAIAMAAAANACAhAACMBgAgIgAAkAYAIBAAAAANACAGAADZBAAgCQAA6wMAIA0AAO0DACATAADsAwAgGgAAkAYAIIACAQDZAwAhiQJAANwDACGcAkAA3AMAIasCAgDpAwAhsQIBANkDACGyAgEA2QMAIbMCAgDpAwAhtAIBANoDACG1AgEA2QMAIbYCAQDZAwAhDgYAANkEACAJAADrAwAgDQAA7QMAIBMAAOwDACCAAgEA2QMAIYkCQADcAwAhnAJAANwDACGrAgIA6QMAIbECAQDZAwAhsgIBANkDACGzAgIA6QMAIbQCAQDaAwAhtQIBANkDACG2AgEA2QMAIQSAAgEAAAABmwIBAAAAAaoCAgAAAAGrAgIAAAABBYACAQAAAAGJAkAAAAABnAJAAAAAAawCAgAAAAG5AgEAAAABAwAAADoAICEAAIgGACAiAACVBgAgDgAAADoAIAQAAMIFACAFAADDBQAgBgAAxAUAIBoAAJUGACCAAgEA2QMAIYQCAQDaAwAhiQJAANwDACGcAkAA3AMAIaECAQDaAwAhsQIBANkDACHJAgEA2QMAIcoCIADBBQAhywIBANoDACEMBAAAwgUAIAUAAMMFACAGAADEBQAggAIBANkDACGEAgEA2gMAIYkCQADcAwAhnAJAANwDACGhAgEA2gMAIbECAQDZAwAhyQIBANkDACHKAiAAwQUAIcsCAQDaAwAhCwMAAJ4EACCAAgEAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIBAAAAAYUCAQAAAAGGAkAAAAABhwIBAAAAAYgCAQAAAAGJAkAAAAABAgAAAOICACAhAACWBgAgAwAAAAsAICEAAJYGACAiAACaBgAgDQAAAAsAIAMAAN0DACAaAACaBgAggAIBANkDACGBAgEA2QMAIYICAQDZAwAhgwIBANkDACGEAgEA2QMAIYUCAQDaAwAhhgJAANsDACGHAgEA2gMAIYgCAQDaAwAhiQJAANwDACELAwAA3QMAIIACAQDZAwAhgQIBANkDACGCAgEA2QMAIYMCAQDZAwAhhAIBANkDACGFAgEA2gMAIYYCQADbAwAhhwIBANoDACGIAgEA2gMAIYkCQADcAwAhCwMAAJAFACANAACSBQAgEAAAkwUAIIACAQAAAAGBAgEAAAABhAIBAAAAAYUCAQAAAAGGAkAAAAABhwIBAAAAAYgCAQAAAAGJAkAAAAABAgAAANoBACAhAACbBgAgBIACAQAAAAGbAgEAAAABqgICAAAAAasCAgAAAAEDAAAANQAgIQAAmwYAICIAAKAGACANAAAANQAgAwAA3gQAIA0AAOAEACAQAADhBAAgGgAAoAYAIIACAQDZAwAhgQIBANkDACGEAgEA2QMAIYUCAQDaAwAhhgJAANsDACGHAgEA2gMAIYgCAQDaAwAhiQJAANwDACELAwAA3gQAIA0AAOAEACAQAADhBAAggAIBANkDACGBAgEA2QMAIYQCAQDZAwAhhQIBANoDACGGAkAA2wMAIYcCAQDaAwAhiAIBANoDACGJAkAA3AMAIQ4GAADaBAAgCQAAmgQAIA0AAJwEACAUAACdBAAggAIBAAAAAYkCQAAAAAGcAkAAAAABqwICAAAAAbECAQAAAAGyAgEAAAABswICAAAAAbQCAQAAAAG1AgEAAAABtgIBAAAAAQIAAAAPACAhAAChBgAgAwAAAA0AICEAAKEGACAiAAClBgAgEAAAAA0AIAYAANkEACAJAADrAwAgDQAA7QMAIBQAAO4DACAaAAClBgAggAIBANkDACGJAkAA3AMAIZwCQADcAwAhqwICAOkDACGxAgEA2QMAIbICAQDZAwAhswICAOkDACG0AgEA2gMAIbUCAQDZAwAhtgIBANkDACEOBgAA2QQAIAkAAOsDACANAADtAwAgFAAA7gMAIIACAQDZAwAhiQJAANwDACGcAkAA3AMAIasCAgDpAwAhsQIBANkDACGyAgEA2QMAIbMCAgDpAwAhtAIBANoDACG1AgEA2QMAIbYCAQDZAwAhCgsAANEEACAPAADSBAAggAIBAAAAAZoCAQAAAAGcAkAAAAABoQIAAACuAgKsAgIAAAABrgIAAAChAgKvAgEAAAABsAJAAAAAAQIAAAAZACAhAACmBgAgAwAAABcAICEAAKYGACAiAACqBgAgDAAAABcAIAsAAMAEACAPAADBBAAgGgAAqgYAIIACAQDZAwAhmgIBANkDACGcAkAA3AMAIaECAAC_BK4CIqwCAgDpAwAhrgIAAK8EoQIirwIBANkDACGwAkAA3AMAIQoLAADABAAgDwAAwQQAIIACAQDZAwAhmgIBANkDACGcAkAA3AMAIaECAAC_BK4CIqwCAgDpAwAhrgIAAK8EoQIirwIBANkDACGwAkAA3AMAIQ4GAADaBAAgCQAAmgQAIBMAAJsEACAUAACdBAAggAIBAAAAAYkCQAAAAAGcAkAAAAABqwICAAAAAbECAQAAAAGyAgEAAAABswICAAAAAbQCAQAAAAG1AgEAAAABtgIBAAAAAQIAAAAPACAhAACrBgAgAwAAAA0AICEAAKsGACAiAACvBgAgEAAAAA0AIAYAANkEACAJAADrAwAgEwAA7AMAIBQAAO4DACAaAACvBgAggAIBANkDACGJAkAA3AMAIZwCQADcAwAhqwICAOkDACGxAgEA2QMAIbICAQDZAwAhswICAOkDACG0AgEA2gMAIbUCAQDZAwAhtgIBANkDACEOBgAA2QQAIAkAAOsDACATAADsAwAgFAAA7gMAIIACAQDZAwAhiQJAANwDACGcAkAA3AMAIasCAgDpAwAhsQIBANkDACGyAgEA2QMAIbMCAgDpAwAhtAIBANoDACG1AgEA2QMAIbYCAQDZAwAhDAQAAOgFACAFAADpBQAgCwAA6wUAIIACAQAAAAGEAgEAAAABiQJAAAAAAZwCQAAAAAGhAgEAAAABsQIBAAAAAckCAQAAAAHKAiAAAAABywIBAAAAAQIAAAABACAhAACwBgAgBYACAQAAAAGJAkAAAAABnAJAAAAAAbECAQAAAAG3AgEAAAABAgAAAMEBACAhAACyBgAgCgsAANEEACARAADTBAAggAIBAAAAAZoCAQAAAAGcAkAAAAABoQIAAACuAgKsAgIAAAABrgIAAAChAgKvAgEAAAABsAJAAAAAAQIAAAAZACAhAAC0BgAgAwAAABcAICEAALQGACAiAAC4BgAgDAAAABcAIAsAAMAEACARAADCBAAgGgAAuAYAIIACAQDZAwAhmgIBANkDACGcAkAA3AMAIaECAAC_BK4CIqwCAgDpAwAhrgIAAK8EoQIirwIBANkDACGwAkAA3AMAIQoLAADABAAgEQAAwgQAIIACAQDZAwAhmgIBANkDACGcAkAA3AMAIaECAAC_BK4CIqwCAgDpAwAhrgIAAK8EoQIirwIBANkDACGwAkAA3AMAIQSAAgEAAAABowIBAAAAAaoCAgAAAAGrAgIAAAABCwMAAJAFACAKAACRBQAgEAAAkwUAIIACAQAAAAGBAgEAAAABhAIBAAAAAYUCAQAAAAGGAkAAAAABhwIBAAAAAYgCAQAAAAGJAkAAAAABAgAAANoBACAhAAC6BgAgAwAAADUAICEAALoGACAiAAC-BgAgDQAAADUAIAMAAN4EACAKAADfBAAgEAAA4QQAIBoAAL4GACCAAgEA2QMAIYECAQDZAwAhhAIBANkDACGFAgEA2gMAIYYCQADbAwAhhwIBANoDACGIAgEA2gMAIYkCQADcAwAhCwMAAN4EACAKAADfBAAgEAAA4QQAIIACAQDZAwAhgQIBANkDACGEAgEA2QMAIYUCAQDaAwAhhgJAANsDACGHAgEA2gMAIYgCAQDaAwAhiQJAANwDACEGgAIBAAAAAYkCQAAAAAGYAgIAAAABmQIBAAAAAZoCAQAAAAGcAkAAAAABBwsAALAFACCAAgEAAAABiQJAAAAAAZoCAQAAAAGcAkAAAAABrAICAAAAAbkCAQAAAAECAAAAIQAgIQAAwAYAIAMAAAAfACAhAADABgAgIgAAxAYAIAkAAAAfACALAACvBQAgGgAAxAYAIIACAQDZAwAhiQJAANwDACGaAgEA2QMAIZwCQADcAwAhrAICAOkDACG5AgEA2QMAIQcLAACvBQAggAIBANkDACGJAkAA3AMAIZoCAQDZAwAhnAJAANwDACGsAgIA6QMAIbkCAQDZAwAhBIACAQAAAAGqAgIAAAABqwICAAAAAbgCAQAAAAEDAAAAxAEAICEAALIGACAiAADIBgAgBwAAAMQBACAaAADIBgAggAIBANkDACGJAkAA3AMAIZwCQADcAwAhsQIBANkDACG3AgEA2gMAIQWAAgEA2QMAIYkCQADcAwAhnAJAANwDACGxAgEA2QMAIbcCAQDaAwAhCYACAQAAAAGJAkAAAAABnAJAAAAAAasCAgAAAAGxAgEAAAABsgIBAAAAAbMCAgAAAAG0AgEAAAABtgIBAAAAAQMAAAA6ACAhAACwBgAgIgAAzAYAIA4AAAA6ACAEAADCBQAgBQAAwwUAIAsAAMUFACAaAADMBgAggAIBANkDACGEAgEA2gMAIYkCQADcAwAhnAJAANwDACGhAgEA2gMAIbECAQDZAwAhyQIBANkDACHKAiAAwQUAIcsCAQDaAwAhDAQAAMIFACAFAADDBQAgCwAAxQUAIIACAQDZAwAhhAIBANoDACGJAkAA3AMAIZwCQADcAwAhoQIBANoDACGxAgEA2QMAIckCAQDZAwAhygIgAMEFACHLAgEA2gMAIQUEBgIFCgMGDAQIABQLNgoBAwABAQMAAQMDAAEHEAUIABMGBgAECAASCQAGDS8LExYIFDANAgcRBQgABwEHEgACDAAFEgAJBAgAEQsACg8rCBEtEAUDAAEIAA8KGgkNHgsQIgwCCwAKDAAFAwgADgsACg8mDQIMAAUOAAwBDycAAwooAA0pABAqAAEKAAkBDy4AAw0yABMxABQzAAEHNAACBDcABTgAAAAAAwgAGScAGigAGwAAAAMIABknABooABsBAwABAQMAAQMIACAnACEoACIAAAADCAAgJwAhKAAiAQMAAQEDAAEDCAAnJwAoKAApAAAAAwgAJycAKCgAKQAAAAMIAC8nADAoADEAAAADCAAvJwAwKAAxAQsACgELAAoFCAA2JwA5KAA6aQA3agA4AAAAAAAFCAA2JwA5KAA6aQA3agA4AgwABQ4ADAIMAAUOAAwFCAA_JwBCKABDaQBAagBBAAAAAAAFCAA_JwBCKABDaQBAagBBAAADCABIJwBJKABKAAAAAwgASCcASSgASgEDAAEBAwABAwgATycAUCgAUQAAAAMIAE8nAFAoAFECBgAECQAGAgYABAkABgUIAFYnAFkoAFppAFdqAFgAAAAAAAUIAFYnAFkoAFppAFdqAFgBCwAKAQsACgUIAF8nAGIoAGNpAGBqAGEAAAAAAAUIAF8nAGIoAGNpAGBqAGECDAAFEgAJAgwABRIACQUIAGgnAGsoAGxpAGlqAGoAAAAAAAUIAGgnAGsoAGxpAGlqAGoBCgAJAQoACQUIAHEnAHQoAHVpAHJqAHMAAAAAAAUIAHEnAHQoAHVpAHJqAHMCCwAKDAAFAgsACgwABQUIAHonAH0oAH5pAHtqAHwAAAAAAAUIAHonAH0oAH5pAHtqAHwBAwABAQMAAQMIAIMBJwCEASgAhQEAAAADCACDAScAhAEoAIUBFQIBFjkBFzwBGD0BGT4BG0ABHEIVHUMWHkUBH0cVIEgXI0kBJEoBJUsVKU4YKk8cK1ACLFECLVICLlMCL1QCMFYCMVgVMlkdM1sCNF0VNV4eNl8CN2ACOGEVOWQfOmUjO2YDPGcDPWgDPmkDP2oDQGwDQW4VQm8kQ3EDRHMVRXQlRnUDR3YDSHcVSXomSnsqS30rTH4rTYEBK06CAStPgwErUIUBK1GHARVSiAEsU4oBK1SMARVVjQEtVo4BK1ePAStYkAEVWZMBLlqUATJblQEMXJYBDF2XAQxemAEMX5kBDGCbAQxhnQEVYp4BM2OgAQxkogEVZaMBNGakAQxnpQEMaKYBFWupATVsqgE7basBDW6sAQ1vrQENcK4BDXGvAQ1ysQENc7MBFXS0ATx1tgENdrgBFXe5AT14ugENebsBDXq8ARV7vwE-fMABRH3CAQZ-wwEGf8YBBoABxwEGgQHIAQaCAcoBBoMBzAEVhAHNAUWFAc8BBoYB0QEVhwHSAUaIAdMBBokB1AEGigHVARWLAdgBR4wB2QFLjQHbAQqOAdwBCo8B3gEKkAHfAQqRAeABCpIB4gEKkwHkARWUAeUBTJUB5wEKlgHpARWXAeoBTZgB6wEKmQHsAQqaAe0BFZsB8AFOnAHxAVKdAfIBBZ4B8wEFnwH0AQWgAfUBBaEB9gEFogH4AQWjAfoBFaQB-wFTpQH9AQWmAf8BFacBgAJUqAGBAgWpAYICBaoBgwIVqwGGAlWsAYcCW60BiAIJrgGJAgmvAYoCCbABiwIJsQGMAgmyAY4CCbMBkAIVtAGRAly1AZMCCbYBlQIVtwGWAl24AZcCCbkBmAIJugGZAhW7AZwCXrwBnQJkvQGeAgi-AZ8CCL8BoAIIwAGhAgjBAaICCMIBpAIIwwGmAhXEAacCZcUBqQIIxgGrAhXHAawCZsgBrQIIyQGuAgjKAa8CFcsBsgJnzAGzAm3NAbUCEM4BtgIQzwG4AhDQAbkCENEBugIQ0gG8AhDTAb4CFdQBvwJu1QHBAhDWAcMCFdcBxAJv2AHFAhDZAcYCENoBxwIV2wHKAnDcAcsCdt0BzAIL3gHNAgvfAc4CC-ABzwIL4QHQAgviAdICC-MB1AIV5AHVAnflAdcCC-YB2QIV5wHaAnjoAdsCC-kB3AIL6gHdAhXrAeACeewB4QJ_7QHjAgTuAeQCBO8B5gIE8AHnAgTxAegCBPIB6gIE8wHsAhX0Ae0CgAH1Ae8CBPYB8QIV9wHyAoEB-AHzAgT5AfQCBPoB9QIV-wH4AoIB_AH5AoYB"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// prisma/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/prisma/enums.ts
var OrderStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELED: "CANCELED"
};
var PaymentStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID"
};

// prisma/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/modules/medicines/medicines.service.ts
var postMedicines = async (data, userId) => {
  const seller = await prisma.seller.findUnique({
    where: { userId }
  });
  if (!seller) {
    throw new Error("Seller not found");
  }
  const result = await prisma.medicines.create({
    data: {
      ...data,
      sellerId: seller?.id
    }
  });
  return result;
};
var getMedicines = async ({
  categoryId,
  price,
  manufacturer,
  search
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (categoryId) {
    andConditions.push({
      categoryId
    });
  }
  if (price) {
    andConditions.push({
      price
    });
  }
  if (manufacturer) {
    andConditions.push({
      manufacturer: {
        contains: manufacturer,
        mode: "insensitive"
      }
    });
  }
  const result = await prisma.medicines.findMany({
    where: {
      AND: andConditions
    }
  });
  return result;
};
var getMedicineById = async (medicineId) => {
  const result = await prisma.medicines.findUnique({
    where: {
      id: medicineId
    }
  });
  return result;
};
var getMedicineBySeller = async (userId) => {
  const seller = await prisma.seller.findUnique({
    where: { userId }
  });
  if (!seller) {
    throw new Error("Seller not found");
  }
  const result = await prisma.medicines.findMany({
    where: {
      sellerId: seller.id
    }
  });
  return result;
};
var updateMedicines = async (data, medicineId) => {
  const result = await prisma.medicines.updateMany({
    where: {
      id: medicineId
    },
    data
  });
  return result;
};
var deleteMedicine = async (medicineId, sellerId) => {
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId
    },
    select: {
      id: true,
      sellerId: true
    }
  });
  if (medicineData.sellerId !== sellerId) {
    throw new Error("You are not the owner");
  }
  return await prisma.medicines.delete({
    where: {
      id: medicineId
    }
  });
};
var MedicinesServices = {
  postMedicines,
  updateMedicines,
  getMedicines,
  getMedicineById,
  getMedicineBySeller,
  deleteMedicine
};

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    },
    cookieOptions: {
      sameSite: "none",
      // cross-domain
      secure: true
      // only HTTPS
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  },
  baseURL: process.env.API_URL,
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "active",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`
    }
  }
});

// src/middlewares/authMiddleware.ts
var authMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authenticated"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        status: session.user.status
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access this resources"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var authMiddleware_default = authMiddleware;

// src/modules/medicines/medicines.controller.ts
var postMedicines2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await MedicinesServices.postMedicines(
      req.body,
      user.id
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create medicine",
      details: error
    });
  }
};
var getMedicines2 = async (req, res) => {
  try {
    const { search, categoryId, price, manufacturer } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const categoryIdString = typeof categoryId === "string" ? categoryId : void 0;
    const priceNumber = typeof price === "number" ? price : null;
    const manufacturerString = typeof manufacturer === "string" ? manufacturer : void 0;
    const result = await MedicinesServices.getMedicines({
      categoryId: categoryIdString,
      price: priceNumber,
      manufacturer: manufacturerString,
      search: searchString
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get medicines",
      details: error
    });
  }
};
var getMedicineById2 = async (req, res) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      throw new Error("This medicine is not available");
    }
    const result = await MedicinesServices.getMedicineById(
      medicineId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Medicine retrieve failed",
      details: error
    });
  }
};
var getMedicineBySeller2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "SELLER" /* SELLER */) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await MedicinesServices.getMedicineBySeller(
      user.id
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Medicine retrieve failed",
      details: error
    });
  }
};
var updateMedicines2 = async (req, res) => {
  try {
    const medicineId = req.params.medicineId;
    if (!medicineId) {
      return res.status(400).json({ error: "Medicine ID is required" });
    }
    const result = await MedicinesServices.updateMedicines(
      req.body,
      medicineId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update medicines"
    });
  }
};
var deleteMedicine2 = async (req, res) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      throw new Error("This medicine is not available");
    }
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }
    const result = await MedicinesServices.deleteMedicine(
      medicineId,
      user.id
    );
    res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Medicine delete failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var MedicinesController = {
  postMedicines: postMedicines2,
  updateMedicines: updateMedicines2,
  getMedicines: getMedicines2,
  getMedicineById: getMedicineById2,
  getMedicineBySeller: getMedicineBySeller2,
  deleteMedicine: deleteMedicine2
};

// src/modules/medicines/medicines.router.ts
var router = express.Router();
router.get("/", MedicinesController.getMedicines);
router.get(
  "/seller",
  authMiddleware_default("SELLER" /* SELLER */),
  MedicinesController.getMedicineBySeller
);
router.get("/:medicineId", MedicinesController.getMedicineById);
router.post(
  "/",
  authMiddleware_default("SELLER" /* SELLER */),
  MedicinesController.postMedicines
);
router.put(
  "/:medicineId",
  authMiddleware_default("SELLER" /* SELLER */),
  MedicinesController.updateMedicines
);
router.delete(
  "/:medicineId",
  authMiddleware_default("SELLER" /* SELLER */),
  MedicinesController.deleteMedicine
);
var medicinesRouter = router;

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

// src/modules/categories/categories.router.ts
import express2 from "express";

// src/modules/categories/categories.service.ts
var createCategory = async (data) => {
  const result = await prisma.categories.create({
    data
  });
  return result;
};
var getCategories = async () => {
  const result = await prisma.categories.findMany();
  return result;
};
var updateCategory = async (id, data) => {
  console.log(id, data);
  const result = await prisma.categories.update({
    where: { id },
    data
  });
  return result;
};
var deleteCategory = async (id) => {
  console.log(id);
  const result = await prisma.categories.delete({
    where: { id }
  });
  console.log(result);
  return result;
};
var CategoriesServices = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};

// src/modules/categories/categories.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const result = await CategoriesServices.createCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create category",
      details: error
    });
  }
};
var getCategories2 = async (req, res) => {
  try {
    const result = await CategoriesServices.getCategories();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get categories",
      details: error
    });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CategoriesServices.updateCategory(
      id,
      req.body
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to update category",
      details: error
    });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CategoriesServices.deleteCategory(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to delete category",
      details: error
    });
  }
};
var CategoriesController = {
  createCategory: createCategory2,
  getCategories: getCategories2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/categories/categories.router.ts
var router2 = express2.Router();
router2.post(
  "/",
  authMiddleware_default("ADMIN" /* ADMIN */),
  CategoriesController.createCategory
);
router2.get("/", CategoriesController.getCategories);
router2.put(
  "/:id",
  authMiddleware_default("ADMIN" /* ADMIN */),
  CategoriesController.updateCategory
);
router2.delete(
  "/:id",
  authMiddleware_default("ADMIN" /* ADMIN */),
  CategoriesController.deleteCategory
);
var categoriesRouter = router2;

// src/modules/user/user.router.ts
import express3 from "express";

// src/modules/user/user.service.ts
var createCustomer = async (data, userId) => {
  const result = await prisma.customer.create({
    data: {
      ...data,
      userId
    }
  });
  return result;
};
var createSeller = async (data, userId) => {
  const seller = await prisma.seller.create({
    data: {
      ...data,
      userId
    }
  });
  await prisma.user.update({
    where: { id: userId },
    data: { role: "SELLER" }
  });
  return seller;
};
var getAllUsers = async ({
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const users = await prisma.user.findMany({
    take: limit,
    skip,
    include: {
      customer: true,
      seller: true
    },
    orderBy: sortBy && sortOrder ? {
      [sortBy]: sortOrder
    } : { createdAt: "desc" }
  });
  const total = await prisma.user.count();
  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var UserServices = {
  createCustomer,
  createSeller,
  getAllUsers
};

// src/helpers/paginationSortingHelper.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/modules/user/user.controller.ts
var createCustomerOrSeller = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;
    console.log(user);
    console.log(data);
    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    if (data.role !== "CUSTOMER" /* CUSTOMER */ && data.role !== "SELLER" /* SELLER */) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role. Must be CUSTOMER or SELLER"
      });
    }
    let result;
    if (data.role === "SELLER" /* SELLER */) {
      result = await UserServices.createSeller(data, user.id);
    } else {
      result = await UserServices.createCustomer(data, user.id);
    }
    return res.status(201).json({
      success: true,
      message: `${data.role} profile created successfully`,
      data: result,
      redirectTo: data.role === "SELLER" /* SELLER */ ? "/seller/dashboard" : "/customer/dashboard"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create customer or seller"
    });
  }
};
var getAllUsers2 = async (req, res) => {
  try {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(
      req.query
    );
    const result = await UserServices.getAllUsers({
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Users retrieve failed",
      details: error
    });
  }
};
var UserController = {
  createCustomerOrSeller,
  getAllUsers: getAllUsers2
};

// src/modules/user/user.router.ts
var router3 = express3.Router();
router3.post(
  "/completeProfile",
  authMiddleware_default(),
  UserController.createCustomerOrSeller
);
router3.get(
  "/allUsers",
  authMiddleware_default("ADMIN" /* ADMIN */),
  UserController.getAllUsers
);
var userRouter = router3;

// src/modules/cart/cart.router.ts
import express4 from "express";

// src/modules/cart/cart.service.ts
var addToCart = async (data, userId) => {
  const medicine = await prisma.medicines.findUnique({
    where: { id: data.medicineId }
  });
  if (!medicine) {
    throw new Error("Invalid medicine");
  }
  const customer = await prisma.customer.findUnique({
    where: { userId }
  });
  let cart = await prisma.cart.upsert({
    where: { customerId: customer?.id },
    update: {},
    create: {
      customerId: customer?.id,
      totalPrice: 0,
      shippingAddress: customer?.address
    }
  });
  const item = await prisma.cartItem.upsert({
    where: {
      cartId_medicineId: {
        cartId: cart.id,
        medicineId: data.medicineId
      }
    },
    update: {
      quantity: { increment: data.quantity }
    },
    create: {
      cartId: cart.id,
      medicineId: data.medicineId,
      quantity: data.quantity,
      price: medicine.price
    }
  });
  cart = await prisma.cart.update({
    where: { id: cart.id },
    data: {
      totalPrice: cart.totalPrice + medicine.price * data.quantity
    }
  });
  return item;
};
var getCart = async (userId) => {
  const customer = await prisma.customer.findUnique({
    where: { userId }
  });
  if (!customer) throw new Error("Customer not found");
  const result = await prisma.cart.findUnique({
    where: { customerId: customer.id },
    include: { items: { include: { medicine: true } } }
  });
  return result;
};
var updateCartItem = async (itemId, quantity) => {
  const result = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity }
  });
  return result;
};
var deleteCartItem = async (itemId) => {
  const result = await prisma.cartItem.delete({
    where: {
      id: itemId
    }
  });
  return result;
};
var CartService = {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem
};

// src/modules/cart/cart.controller.ts
var addToCart2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const data = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await CartService.addToCart(data, userId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to add to cart",
      details: error
    });
  }
};
var getCart2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await CartService.getCart(userId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get cart items",
      details: error
    });
  }
};
var updateCartItem2 = async (req, res) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (!itemId) {
      return res.status(401).json({ error: "This medicine is not in the cart" });
    }
    const result = await CartService.updateCartItem(itemId, quantity);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to update cart items",
      details: error
    });
  }
};
var deleteCartItem2 = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!itemId) {
      return res.status(401).json({ error: "This medicine is not in the cart" });
    }
    const result = await CartService.deleteCartItem(itemId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to delete cart items",
      details: error
    });
  }
};
var CartController = {
  addToCart: addToCart2,
  getCart: getCart2,
  updateCartItem: updateCartItem2,
  deleteCartItem: deleteCartItem2
};

// src/modules/cart/cart.router.ts
var router4 = express4.Router();
router4.post(
  "/add",
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
  CartController.addToCart
);
router4.get("/", authMiddleware_default("CUSTOMER" /* CUSTOMER */), CartController.getCart);
router4.put(
  "/items/:itemId",
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
  CartController.updateCartItem
);
router4.delete(
  "/items/:itemId",
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
  CartController.deleteCartItem
);
var cartRouter = router4;

// src/modules/orders/orders.router.ts
import express5 from "express";

// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET"
  ];
  requiredEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(
        `Environment variable ${variable} is required but not set in .env file`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    }
  };
};
var envVars = loadEnvVariables();

// src/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/modules/orders/orders.service.ts
import { v7 as uuidv7 } from "uuid";
var checkout = async (userId) => {
  const customer = await prisma.customer.findUnique({
    where: { userId }
  });
  if (!customer) throw new Error("User not found");
  const cart = await prisma.cart.findUnique({
    where: { customerId: customer.id },
    include: { items: true }
  });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const order = await prisma.orders.create({
    data: {
      customerId: customer.id,
      totalPrice,
      status: "PENDING",
      items: {
        create: cart.items.map((item) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: {
      items: true
    }
  });
  const transactionId = String(uuidv7());
  const paymentData = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: totalPrice,
      transactionId
    }
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: cart.items.map((item) => ({
      price_data: {
        currency: "bdt",
        product_data: {
          name: item.medicineId
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    })),
    metadata: {
      orderId: order.id,
      paymentId: paymentData.id
    },
    success_url: `${envVars.FRONTEND_URL}/payment-success`,
    cancel_url: `${envVars.FRONTEND_URL}/orders`
  });
  return {
    order,
    url: session.url
  };
};
var updateOrderStatus = async (orderId, userId, status) => {
  const seller = await prisma.seller.findUnique({
    where: { userId }
  });
  if (!seller) {
    throw new Error("Seller not found");
  }
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { medicine: true } }
    }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  const ownsMedicine = order.items.some(
    (item) => item.medicine.sellerId === seller.id
    // now both are UUIDs
  );
  if (!ownsMedicine) {
    throw new Error("Unauthorized: Seller does not own this order's items");
  }
  return await prisma.orders.update({
    where: { id: orderId },
    data: { status }
  });
};
var getAllOrders = async () => {
  const orders = await prisma.orders.findMany({
    orderBy: { orderedAt: "desc" }
  });
  return orders;
};
var getSellerOrders = async (userId) => {
  const seller = await prisma.seller.findUnique({
    where: { userId }
  });
  if (!seller) {
    throw new Error("User not found");
  }
  const orders = await prisma.orders.findMany({
    where: {
      items: {
        some: {
          medicine: {
            sellerId: seller.id
          }
        }
      }
    },
    include: {
      items: {
        include: {
          medicine: true
        }
      }
    },
    orderBy: { orderedAt: "desc" }
  });
  return orders;
};
var getCustomerOrders = async (userId) => {
  const customer = await prisma.customer.findUnique({
    where: { userId }
  });
  if (!customer) {
    throw new Error("User not found");
  }
  const orders = await prisma.orders.findMany({
    where: { customerId: customer.id },
    include: {
      items: {
        include: { medicine: true }
      }
    },
    orderBy: { orderedAt: "desc" }
  });
  return orders;
};
var getOrderDetails = async (orderId, userId, role) => {
  if (role === "ADMIN") {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { medicine: true } }
      }
    });
    if (!order) throw new Error("Order not found");
    return order;
  }
  if (role === "CUSTOMER") {
    const customer = await prisma.customer.findUnique({ where: { userId } });
    if (!customer) throw new Error("Customer profile not found");
    const order = await prisma.orders.findFirst({
      where: { id: orderId, customerId: customer.id },
      include: {
        items: { include: { medicine: true } }
      }
    });
    if (!order) throw new Error("Order not found or unauthorized");
    return order;
  }
  if (role === "SELLER") {
    const seller = await prisma.seller.findUnique({ where: { userId } });
    if (!seller) throw new Error("Seller profile not found");
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        items: {
          where: { medicine: { sellerId: seller.id } },
          include: { medicine: true }
        }
      }
    });
    if (!order || order.items.length === 0) {
      throw new Error("Order not found or no items for this seller");
    }
    return order;
  }
};
var orderService = {
  checkout,
  updateOrderStatus,
  getAllOrders,
  getSellerOrders,
  getCustomerOrders,
  getOrderDetails
};

// src/modules/orders/orders.controller.ts
var checkout2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const result = await orderService.checkout(userId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Checkout failed",
      details: error.message
    });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const sellerId = req.user?.id;
    if (!sellerId) {
      throw new Error("Unauthorized");
    }
    const result = await orderService.updateOrderStatus(
      orderId,
      sellerId,
      status
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to update order status",
      details: error.message
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const result = await orderService.getAllOrders();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get orders",
      details: error
    });
  }
};
var getOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw new Error("Unauthorized");
    }
    let result;
    if (role === "SELLER" /* SELLER */) {
      result = await orderService.getSellerOrders(userId);
    } else if (role === "CUSTOMER" /* CUSTOMER */) {
      result = await orderService.getCustomerOrders(userId);
    } else {
      throw new Error("Not allowed");
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch orders",
      details: error.message
    });
  }
};
var getOrderDetails2 = async (req, res) => {
  try {
    const user = req.user;
    const { orderId } = req.params;
    if (!user?.id) {
      throw new Error("Unauthorized");
    }
    const result = await orderService.getOrderDetails(
      orderId,
      user.id,
      user.role
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch order details",
      details: error.message
    });
  }
};
var ordersController = {
  checkout: checkout2,
  updateOrderStatus: updateOrderStatus2,
  getAllOrders: getAllOrders2,
  getOrders,
  getOrderDetails: getOrderDetails2
};

// src/modules/orders/orders.router.ts
var router5 = express5.Router();
router5.post(
  "/checkout",
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
  ordersController.checkout
);
router5.get(
  "/allOrders",
  authMiddleware_default("ADMIN" /* ADMIN */),
  ordersController.getAllOrders
);
router5.get(
  "/",
  authMiddleware_default("SELLER" /* SELLER */, "CUSTOMER" /* CUSTOMER */),
  ordersController.getOrders
);
router5.get(
  "/:orderId",
  authMiddleware_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */, "CUSTOMER" /* CUSTOMER */),
  ordersController.getOrderDetails
);
router5.put(
  "/:orderId",
  authMiddleware_default("SELLER" /* SELLER */),
  ordersController.updateOrderStatus
);
var ordersRouter = router5;

// src/modules/reviews/reviews.router.ts
import express6 from "express";

// src/modules/reviews/reviews.service.ts
var createReviews = async (data, medicineId, userId) => {
  const customer = await prisma.customer.findUnique({
    where: { userId }
  });
  const result = await prisma.reviews.create({
    data: {
      ...data,
      medicineId,
      customerId: customer?.id
    },
    include: {
      customer: {
        include: {
          user: {
            select: { name: true, image: true }
          }
        }
      }
    }
  });
  return result;
};
var getReviews = async (medicineId) => {
  const result = await prisma.reviews.findMany({
    where: { medicineId },
    include: {
      customer: {
        include: {
          user: {
            select: { name: true, image: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  console.log(result);
  return result;
};
var reviewsService = {
  createReviews,
  getReviews
};

// src/modules/reviews/reviews.controller.ts
var createReviews2 = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const data = req.body;
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("You are unauthorized");
    }
    const result = await reviewsService.createReviews(
      data,
      medicineId,
      userId
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create reviews",
      details: error
    });
  }
};
var getReviews2 = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const result = await reviewsService.getReviews(medicineId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get reviews",
      details: error
    });
  }
};
var reviewsController = {
  createReviews: createReviews2,
  getReviews: getReviews2
};

// src/modules/reviews/reviews.router.ts
var router6 = express6.Router();
router6.post(
  "/:medicineId",
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
  reviewsController.createReviews
);
router6.get("/:medicineId", reviewsController.getReviews);
var reviewsRouter = router6;

// src/modules/payment/payment.service.ts
var handlerStripeWebhookEvent = async (event) => {
  console.log("webhook ping");
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id
    }
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      if (!orderId || !paymentId) {
        console.error("Missing orderId or paymentId in session metadata");
        return { message: "Missing orderId or paymentId in session metadata" };
      }
      console.log("OrderId ar payment id paisi");
      const order = await prisma.orders.findUnique({
        where: {
          id: orderId
        },
        include: {
          items: true
        }
      });
      if (!order) {
        console.error(`Order with id ${orderId} not found`);
        return { message: `Order with id ${orderId} not found` };
      }
      await prisma.$transaction(async (tx) => {
        await tx.orders.update({
          where: {
            id: orderId
          },
          data: {
            status: OrderStatus.PROCESSING,
            paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
          }
        });
        await tx.payment.update({
          where: {
            id: paymentId
          },
          data: {
            stripeEventId: event.id,
            status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            paymentGatewayData: session
          }
        });
      });
      const cart = await prisma.cart.findUnique({
        where: {
          customerId: order.customerId
        },
        include: {
          items: true
        }
      });
      console.log(cart);
      if (!cart) {
        console.error("Cart not found for customer:", order.customerId);
        return;
      }
      for (const item of cart.items) {
        await prisma.medicines.update({
          where: { id: item.medicineId },
          data: { stockQuantity: { decrement: item.quantity } }
        });
      }
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await prisma.cart.update({
        where: { id: cart.id },
        data: { totalPrice: 0 }
      });
      console.log(
        `Processed checkout.session.completed for order ${orderId} and payment ${paymentId}`
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed.`
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      console.log(
        `Payment intent ${session.id} failed. Marking associated payment as failed.`
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: `Webhook Event ${event.id} processed successfully` };
};
var PaymentService = {
  handlerStripeWebhookEvent
};

// src/modules/payment/payment.controller.ts
var handleStripeWebhookEvent = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res.status(404).json({ message: "Missing Stripe signature or webhook secret" });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return res.status(400).json({ message: "Error processing Stripe webhook" });
  }
  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    res.status(500).json({ message: "Error handling Stripe webhook event" });
  }
};
var PaymentController = {
  handleStripeWebhookEvent
};

// src/app.ts
var app = express7();
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL
  // Production frontend URL
].filter(Boolean);
app.post(
  "/webhook",
  express7.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express7.json());
app.use("/api/categories", categoriesRouter);
app.use("/api/medicines", medicinesRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", ordersRouter);
app.use("/api/reviews", reviewsRouter);
app.get("/", (req, res) => {
  res.send("Hello World");
});
var app_default = app;
export {
  app_default as default
};
