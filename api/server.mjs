// src/app.ts
import express7 from "express";

// src/modules/medicines/medicines.router.ts
import express from "express";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.4.2",
  "engineVersion": "94a226be1cf2967af2541cca5529f0f7ba866919",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Medicines {\n  id            String     @id @default(uuid())\n  name          String     @db.VarChar(255)\n  manufacturer  String\n  price         Int\n  stockQuantity Int\n  imageUrl      String?\n  sellerId      String\n  seller        Seller     @relation(fields: [sellerId], references: [id])\n  categoryId    String\n  category      Categories @relation(fields: [categoryId], references: [id])\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n\n  orderItems OrderItem[]\n  reviews    Reviews[]\n  cartItems  CartItem[]\n\n  @@index([sellerId, categoryId])\n}\n\nmodel Categories {\n  id        String      @id @default(uuid())\n  name      String      @unique @db.VarChar(255)\n  details   String?     @db.Text\n  createdAt DateTime    @default(now())\n  updatedAt DateTime    @updatedAt\n  medicines Medicines[]\n}\n\nmodel Cart {\n  id              String   @id @default(uuid())\n  customerId      String   @unique\n  customer        Customer @relation(fields: [customerId], references: [id])\n  shippingAddress String\n  totalPrice      Int\n  createdAt       DateTime @default(now())\n  updatedAt       DateTime @updatedAt\n\n  items CartItem[]\n}\n\nmodel CartItem {\n  id         String    @id @default(uuid())\n  cartId     String\n  cart       Cart      @relation(fields: [cartId], references: [id])\n  medicineId String\n  medicine   Medicines @relation(fields: [medicineId], references: [id])\n  quantity   Int\n  price      Int\n\n  @@unique([cartId, medicineId])\n}\n\nmodel Orders {\n  id         String      @id @default(uuid())\n  customerId String\n  customer   Customer    @relation(fields: [customerId], references: [id])\n  totalPrice Int\n  status     OrderStatus\n  orderedAt  DateTime    @default(now())\n  updatedAt  DateTime    @updatedAt\n\n  items OrderItem[]\n\n  @@index([customerId])\n}\n\nmodel OrderItem {\n  id         String    @id @default(uuid())\n  orderId    String\n  order      Orders    @relation(fields: [orderId], references: [id])\n  medicineId String\n  medicine   Medicines @relation(fields: [medicineId], references: [id])\n  quantity   Int\n  price      Int\n\n  @@index([orderId, medicineId])\n}\n\nmodel Reviews {\n  id         String    @id @default(uuid())\n  rating     Int\n  comment    String?   @db.Text\n  customerId String\n  customer   Customer  @relation(fields: [customerId], references: [id])\n  medicineId String\n  medicine   Medicines @relation(fields: [medicineId], references: [id])\n  createdAt  DateTime  @default(now())\n  updatedAt  DateTime  @updatedAt\n\n  @@index([customerId, medicineId])\n}\n\nenum OrderStatus {\n  PENDING\n  SHIPPED\n  DELIVERED\n  CANCELED\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  seller        Seller?\n  customer      Customer?\n\n  role   String? @default("CUSTOMER")\n  status String? @default("active")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Seller {\n  id            String    @id @default(uuid())\n  userId        String    @unique\n  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  pharmacyName  String\n  licenseNumber String\n  role          String\n  phoneNumber   String?\n  dateOfBirth   DateTime?\n  gender        String?\n  address       String?\n  createdAt     DateTime  @default(now())\n\n  medicines Medicines[]\n}\n\nmodel Customer {\n  id          String    @id @default(uuid())\n  userId      String    @unique\n  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  role        String\n  phoneNumber String?\n  dateOfBirth DateTime?\n  gender      String?\n  address     String?\n  createdAt   DateTime  @default(now())\n\n  orders  Orders[]\n  reviews Reviews[]\n  carts   Cart[]\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"Medicines":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"stockQuantity","kind":"scalar","type":"Int"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"Seller","relationName":"MedicinesToSeller"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Categories","relationName":"CategoriesToMedicines"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicinesToOrderItem"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"MedicinesToReviews"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMedicines"}],"dbName":null},"Categories":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"CategoriesToMedicines"}],"dbName":null},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"Customer","relationName":"CartToCustomer"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"totalPrice","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicines","relationName":"CartItemToMedicines"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Int"}],"dbName":null},"Orders":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToOrders"},{"name":"totalPrice","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"orderedAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderItemToOrders"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Orders","relationName":"OrderItemToOrders"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicines","relationName":"MedicinesToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Int"}],"dbName":null},"Reviews":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToReviews"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicines","relationName":"MedicinesToReviews"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"seller","kind":"object","type":"Seller","relationName":"SellerToUser"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"}],"dbName":"user"},"Seller":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SellerToUser"},{"name":"pharmacyName","kind":"scalar","type":"String"},{"name":"licenseNumber","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"gender","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"MedicinesToSeller"}],"dbName":null},"Customer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CustomerToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"gender","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"orders","kind":"object","type":"Orders","relationName":"CustomerToOrders"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"CustomerToReviews"},{"name":"carts","kind":"object","type":"Cart","relationName":"CartToCustomer"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","seller","customer","order","medicine","items","_count","orders","reviews","cart","carts","medicines","category","orderItems","cartItems","Medicines.findUnique","Medicines.findUniqueOrThrow","Medicines.findFirst","Medicines.findFirstOrThrow","Medicines.findMany","data","Medicines.createOne","Medicines.createMany","Medicines.createManyAndReturn","Medicines.updateOne","Medicines.updateMany","Medicines.updateManyAndReturn","create","update","Medicines.upsertOne","Medicines.deleteOne","Medicines.deleteMany","having","_avg","_sum","_min","_max","Medicines.groupBy","Medicines.aggregate","Categories.findUnique","Categories.findUniqueOrThrow","Categories.findFirst","Categories.findFirstOrThrow","Categories.findMany","Categories.createOne","Categories.createMany","Categories.createManyAndReturn","Categories.updateOne","Categories.updateMany","Categories.updateManyAndReturn","Categories.upsertOne","Categories.deleteOne","Categories.deleteMany","Categories.groupBy","Categories.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","Cart.groupBy","Cart.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Orders.findUnique","Orders.findUniqueOrThrow","Orders.findFirst","Orders.findFirstOrThrow","Orders.findMany","Orders.createOne","Orders.createMany","Orders.createManyAndReturn","Orders.updateOne","Orders.updateMany","Orders.updateManyAndReturn","Orders.upsertOne","Orders.deleteOne","Orders.deleteMany","Orders.groupBy","Orders.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Reviews.findUnique","Reviews.findUniqueOrThrow","Reviews.findFirst","Reviews.findFirstOrThrow","Reviews.findMany","Reviews.createOne","Reviews.createMany","Reviews.createManyAndReturn","Reviews.updateOne","Reviews.updateMany","Reviews.updateManyAndReturn","Reviews.upsertOne","Reviews.deleteOne","Reviews.deleteMany","Reviews.groupBy","Reviews.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Seller.findUnique","Seller.findUniqueOrThrow","Seller.findFirst","Seller.findFirstOrThrow","Seller.findMany","Seller.createOne","Seller.createMany","Seller.createManyAndReturn","Seller.updateOne","Seller.updateMany","Seller.updateManyAndReturn","Seller.upsertOne","Seller.deleteOne","Seller.deleteMany","Seller.groupBy","Seller.aggregate","Customer.findUnique","Customer.findUniqueOrThrow","Customer.findFirst","Customer.findFirstOrThrow","Customer.findMany","Customer.createOne","Customer.createMany","Customer.createManyAndReturn","Customer.updateOne","Customer.updateMany","Customer.updateManyAndReturn","Customer.upsertOne","Customer.deleteOne","Customer.deleteMany","Customer.groupBy","Customer.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","AND","OR","NOT","id","identifier","value","expiresAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","accountId","providerId","userId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","role","phoneNumber","dateOfBirth","gender","address","every","some","none","pharmacyName","licenseNumber","name","email","emailVerified","image","status","rating","comment","customerId","medicineId","orderId","quantity","price","totalPrice","OrderStatus","orderedAt","cartId","shippingAddress","details","manufacturer","stockQuantity","imageUrl","sellerId","categoryId","cartId_medicineId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "iwZ80AESBgAAmQMAIA0AAPoCACARAACaAwAgEgAAmwMAIBMAAJwDACDsAQAAlwMAMO0BAAAqABDuAQAAlwMAMO8BAQAAAAHzAUAA6gIAIfQBQADqAgAhlwIBAOkCACGiAgIAmAMAIakCAQDpAgAhqgICAJgDACGrAgEA9gIAIawCAQDpAgAhrQIBAOkCACEBAAAAAQAgDAMAAPgCACDsAQAAqQMAMO0BAAADABDuAQAAqQMAMO8BAQDpAgAh8gFAAOoCACHzAUAA6gIAIfQBQADqAgAhggIBAOkCACGKAgEA6QIAIYsCAQD2AgAhjAIBAPYCACEDAwAAjwQAIIsCAACvAwAgjAIAAK8DACAMAwAA-AIAIOwBAACpAwAw7QEAAAMAEO4BAACpAwAw7wEBAAAAAfIBQADqAgAh8wFAAOoCACH0AUAA6gIAIYICAQDpAgAhigIBAAAAAYsCAQD2AgAhjAIBAPYCACEDAAAAAwAgAQAABAAwAgAABQAgEQMAAPgCACDsAQAAqAMAMO0BAAAHABDuAQAAqAMAMO8BAQDpAgAh8wFAAOoCACH0AUAA6gIAIYACAQDpAgAhgQIBAOkCACGCAgEA6QIAIYMCAQD2AgAhhAIBAPYCACGFAgEA9gIAIYYCQAD3AgAhhwJAAPcCACGIAgEA9gIAIYkCAQD2AgAhCAMAAI8EACCDAgAArwMAIIQCAACvAwAghQIAAK8DACCGAgAArwMAIIcCAACvAwAgiAIAAK8DACCJAgAArwMAIBEDAAD4AgAg7AEAAKgDADDtAQAABwAQ7gEAAKgDADDvAQEAAAAB8wFAAOoCACH0AUAA6gIAIYACAQDpAgAhgQIBAOkCACGCAgEA6QIAIYMCAQD2AgAhhAIBAPYCACGFAgEA9gIAIYYCQAD3AgAhhwJAAPcCACGIAgEA9gIAIYkCAQD2AgAhAwAAAAcAIAEAAAgAMAIAAAkAIA8DAAD4AgAgEAAA_gIAIOwBAAD9AgAw7QEAAAsAEO4BAAD9AgAw7wEBAOkCACHzAUAA6gIAIYICAQDpAgAhjQIBAOkCACGOAgEA9gIAIY8CQAD3AgAhkAIBAPYCACGRAgEA9gIAIZUCAQDpAgAhlgIBAOkCACEBAAAACwAgDwMAAPgCACAMAAD5AgAgDQAA-gIAIA8AAPsCACDsAQAA9QIAMO0BAAANABDuAQAA9QIAMO8BAQDpAgAh8wFAAOoCACGCAgEA6QIAIY0CAQDpAgAhjgIBAPYCACGPAkAA9wIAIZACAQD2AgAhkQIBAPYCACEBAAAADQAgCwcAAKIDACAKAACbAwAg7AEAAKYDADDtAQAADwAQ7gEAAKYDADDvAQEA6QIAIfQBQADqAgAhmwIAAKcDpQIingIBAOkCACGjAgIAmAMAIaUCQADqAgAhAgcAAIEFACAKAAC1BQAgCwcAAKIDACAKAACbAwAg7AEAAKYDADDtAQAADwAQ7gEAAKYDADDvAQEAAAAB9AFAAOoCACGbAgAApwOlAiKeAgEA6QIAIaMCAgCYAwAhpQJAAOoCACEDAAAADwAgAQAAEAAwAgAAEQAgCggAAKUDACAJAACgAwAg7AEAAKQDADDtAQAAEwAQ7gEAAKQDADDvAQEA6QIAIZ8CAQDpAgAhoAIBAOkCACGhAgIAmAMAIaICAgCYAwAhAggAALkFACAJAAC4BQAgCggAAKUDACAJAACgAwAg7AEAAKQDADDtAQAAEwAQ7gEAAKQDADDvAQEAAAABnwIBAOkCACGgAgEA6QIAIaECAgCYAwAhogICAJgDACEDAAAAEwAgAQAAFAAwAgAAFQAgAQAAABMAIAwHAACiAwAgCQAAoAMAIOwBAACjAwAw7QEAABgAEO4BAACjAwAw7wEBAOkCACHzAUAA6gIAIfQBQADqAgAhnAICAJgDACGdAgEA9gIAIZ4CAQDpAgAhnwIBAOkCACEDBwAAgQUAIAkAALgFACCdAgAArwMAIAwHAACiAwAgCQAAoAMAIOwBAACjAwAw7QEAABgAEO4BAACjAwAw7wEBAAAAAfMBQADqAgAh9AFAAOoCACGcAgIAmAMAIZ0CAQD2AgAhngIBAOkCACGfAgEA6QIAIQMAAAAYACABAAAZADACAAAaACALBwAAogMAIAoAAJwDACDsAQAAoQMAMO0BAAAcABDuAQAAoQMAMO8BAQDpAgAh8wFAAOoCACH0AUAA6gIAIZ4CAQDpAgAhowICAJgDACGnAgEA6QIAIQIHAACBBQAgCgAAtgUAIAsHAACiAwAgCgAAnAMAIOwBAAChAwAw7QEAABwAEO4BAAChAwAw7wEBAAAAAfMBQADqAgAh9AFAAOoCACGeAgEAAAABowICAJgDACGnAgEA6QIAIQMAAAAcACABAAAdADACAAAeACAKCQAAoAMAIA4AAJ8DACDsAQAAngMAMO0BAAAgABDuAQAAngMAMO8BAQDpAgAhnwIBAOkCACGhAgIAmAMAIaICAgCYAwAhpgIBAOkCACECCQAAuAUAIA4AALcFACALCQAAoAMAIA4AAJ8DACDsAQAAngMAMO0BAAAgABDuAQAAngMAMO8BAQAAAAGfAgEA6QIAIaECAgCYAwAhogICAJgDACGmAgEA6QIAIa4CAACdAwAgAwAAACAAIAEAACEAMAIAACIAIAEAAAAgACABAAAADwAgAQAAABgAIAEAAAAcACABAAAAAwAgAQAAAAcAIBIGAACZAwAgDQAA-gIAIBEAAJoDACASAACbAwAgEwAAnAMAIOwBAACXAwAw7QEAACoAEO4BAACXAwAw7wEBAOkCACHzAUAA6gIAIfQBQADqAgAhlwIBAOkCACGiAgIAmAMAIakCAQDpAgAhqgICAJgDACGrAgEA9gIAIawCAQDpAgAhrQIBAOkCACEGBgAAgAUAIA0AAJEEACARAAC0BQAgEgAAtQUAIBMAALYFACCrAgAArwMAIAMAAAAqACABAAArADACAAABACABAAAAKgAgAwAAACoAIAEAACsAMAIAAAEAIAEAAAAqACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAgACABAAAhADACAAAiACABAAAAEwAgAQAAABgAIAEAAAAgACABAAAAAQAgAwAAACoAIAEAACsAMAIAAAEAIAMAAAAqACABAAArADACAAABACADAAAAKgAgAQAAKwAwAgAAAQAgDwYAAK0FACANAADLBAAgEQAAyQQAIBIAAMoEACATAADMBAAg7wEBAAAAAfMBQAAAAAH0AUAAAAABlwIBAAAAAaICAgAAAAGpAgEAAAABqgICAAAAAasCAQAAAAGsAgEAAAABrQIBAAAAAQEZAAA6ACAK7wEBAAAAAfMBQAAAAAH0AUAAAAABlwIBAAAAAaICAgAAAAGpAgEAAAABqgICAAAAAasCAQAAAAGsAgEAAAABrQIBAAAAAQEZAAA8ADABGQAAPAAwDwYAAKsFACANAAClBAAgEQAAowQAIBIAAKQEACATAACmBAAg7wEBAK0DACHzAUAArgMAIfQBQACuAwAhlwIBAK0DACGiAgIAzQMAIakCAQCtAwAhqgICAM0DACGrAgEAswMAIawCAQCtAwAhrQIBAK0DACECAAAAAQAgGQAAPwAgCu8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZcCAQCtAwAhogICAM0DACGpAgEArQMAIaoCAgDNAwAhqwIBALMDACGsAgEArQMAIa0CAQCtAwAhAgAAACoAIBkAAEEAIAIAAAAqACAZAABBACADAAAAAQAgIAAAOgAgIQAAPwAgAQAAAAEAIAEAAAAqACAGCwAArwUAICYAALAFACAnAACzBQAgKAAAsgUAICkAALEFACCrAgAArwMAIA3sAQAAlgMAMO0BAABIABDuAQAAlgMAMO8BAQDhAgAh8wFAAOICACH0AUAA4gIAIZcCAQDhAgAhogICAIoDACGpAgEA4QIAIaoCAgCKAwAhqwIBAOwCACGsAgEA4QIAIa0CAQDhAgAhAwAAACoAIAEAAEcAMCUAAEgAIAMAAAAqACABAAArADACAAABACAJEAAA_gIAIOwBAACVAwAw7QEAAE4AEO4BAACVAwAw7wEBAAAAAfMBQADqAgAh9AFAAOoCACGXAgEAAAABqAIBAPYCACEBAAAASwAgAQAAAEsAIAkQAAD-AgAg7AEAAJUDADDtAQAATgAQ7gEAAJUDADDvAQEA6QIAIfMBQADqAgAh9AFAAOoCACGXAgEA6QIAIagCAQD2AgAhAhAAAM8EACCoAgAArwMAIAMAAABOACABAABPADACAABLACADAAAATgAgAQAATwAwAgAASwAgAwAAAE4AIAEAAE8AMAIAAEsAIAYQAACuBQAg7wEBAAAAAfMBQAAAAAH0AUAAAAABlwIBAAAAAagCAQAAAAEBGQAAUwAgBe8BAQAAAAHzAUAAAAAB9AFAAAAAAZcCAQAAAAGoAgEAAAABARkAAFUAMAEZAABVADAGEAAAogUAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZcCAQCtAwAhqAIBALMDACECAAAASwAgGQAAWAAgBe8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZcCAQCtAwAhqAIBALMDACECAAAATgAgGQAAWgAgAgAAAE4AIBkAAFoAIAMAAABLACAgAABTACAhAABYACABAAAASwAgAQAAAE4AIAQLAACfBQAgKAAAoQUAICkAAKAFACCoAgAArwMAIAjsAQAAlAMAMO0BAABhABDuAQAAlAMAMO8BAQDhAgAh8wFAAOICACH0AUAA4gIAIZcCAQDhAgAhqAIBAOwCACEDAAAATgAgAQAAYAAwJQAAYQAgAwAAAE4AIAEAAE8AMAIAAEsAIAEAAAAeACABAAAAHgAgAwAAABwAIAEAAB0AMAIAAB4AIAMAAAAcACABAAAdADACAAAeACADAAAAHAAgAQAAHQAwAgAAHgAgCAcAAJ4FACAKAADfAwAg7wEBAAAAAfMBQAAAAAH0AUAAAAABngIBAAAAAaMCAgAAAAGnAgEAAAABARkAAGkAIAbvAQEAAAAB8wFAAAAAAfQBQAAAAAGeAgEAAAABowICAAAAAacCAQAAAAEBGQAAawAwARkAAGsAMAgHAACdBQAgCgAAzwMAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZ4CAQCtAwAhowICAM0DACGnAgEArQMAIQIAAAAeACAZAABuACAG7wEBAK0DACHzAUAArgMAIfQBQACuAwAhngIBAK0DACGjAgIAzQMAIacCAQCtAwAhAgAAABwAIBkAAHAAIAIAAAAcACAZAABwACADAAAAHgAgIAAAaQAgIQAAbgAgAQAAAB4AIAEAAAAcACAFCwAAmAUAICYAAJkFACAnAACcBQAgKAAAmwUAICkAAJoFACAJ7AEAAJMDADDtAQAAdwAQ7gEAAJMDADDvAQEA4QIAIfMBQADiAgAh9AFAAOICACGeAgEA4QIAIaMCAgCKAwAhpwIBAOECACEDAAAAHAAgAQAAdgAwJQAAdwAgAwAAABwAIAEAAB0AMAIAAB4AIAEAAAAiACABAAAAIgAgAwAAACAAIAEAACEAMAIAACIAIAMAAAAgACABAAAhADACAAAiACADAAAAIAAgAQAAIQAwAgAAIgAgBwkAAN0DACAOAACxBAAg7wEBAAAAAZ8CAQAAAAGhAgIAAAABogICAAAAAaYCAQAAAAEBGQAAfwAgBe8BAQAAAAGfAgEAAAABoQICAAAAAaICAgAAAAGmAgEAAAABARkAAIEBADABGQAAgQEAMAcJAADbAwAgDgAArwQAIO8BAQCtAwAhnwIBAK0DACGhAgIAzQMAIaICAgDNAwAhpgIBAK0DACECAAAAIgAgGQAAhAEAIAXvAQEArQMAIZ8CAQCtAwAhoQICAM0DACGiAgIAzQMAIaYCAQCtAwAhAgAAACAAIBkAAIYBACACAAAAIAAgGQAAhgEAIAMAAAAiACAgAAB_ACAhAACEAQAgAQAAACIAIAEAAAAgACAFCwAAkwUAICYAAJQFACAnAACXBQAgKAAAlgUAICkAAJUFACAI7AEAAJIDADDtAQAAjQEAEO4BAACSAwAw7wEBAOECACGfAgEA4QIAIaECAgCKAwAhogICAIoDACGmAgEA4QIAIQMAAAAgACABAACMAQAwJQAAjQEAIAMAAAAgACABAAAhADACAAAiACABAAAAEQAgAQAAABEAIAMAAAAPACABAAAQADACAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAgHAACSBQAgCgAAigQAIO8BAQAAAAH0AUAAAAABmwIAAAClAgKeAgEAAAABowICAAAAAaUCQAAAAAEBGQAAlQEAIAbvAQEAAAAB9AFAAAAAAZsCAAAApQICngIBAAAAAaMCAgAAAAGlAkAAAAABARkAAJcBADABGQAAlwEAMAgHAACRBQAgCgAA-gMAIO8BAQCtAwAh9AFAAK4DACGbAgAA-AOlAiKeAgEArQMAIaMCAgDNAwAhpQJAAK4DACECAAAAEQAgGQAAmgEAIAbvAQEArQMAIfQBQACuAwAhmwIAAPgDpQIingIBAK0DACGjAgIAzQMAIaUCQACuAwAhAgAAAA8AIBkAAJwBACACAAAADwAgGQAAnAEAIAMAAAARACAgAACVAQAgIQAAmgEAIAEAAAARACABAAAADwAgBQsAAIwFACAmAACNBQAgJwAAkAUAICgAAI8FACApAACOBQAgCewBAACOAwAw7QEAAKMBABDuAQAAjgMAMO8BAQDhAgAh9AFAAOICACGbAgAAjwOlAiKeAgEA4QIAIaMCAgCKAwAhpQJAAOICACEDAAAADwAgAQAAogEAMCUAAKMBACADAAAADwAgAQAAEAAwAgAAEQAgAQAAABUAIAEAAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACAHCAAAxwQAIAkAAIgEACDvAQEAAAABnwIBAAAAAaACAQAAAAGhAgIAAAABogICAAAAAQEZAACrAQAgBe8BAQAAAAGfAgEAAAABoAIBAAAAAaECAgAAAAGiAgIAAAABARkAAK0BADABGQAArQEAMAcIAADFBAAgCQAAhgQAIO8BAQCtAwAhnwIBAK0DACGgAgEArQMAIaECAgDNAwAhogICAM0DACECAAAAFQAgGQAAsAEAIAXvAQEArQMAIZ8CAQCtAwAhoAIBAK0DACGhAgIAzQMAIaICAgDNAwAhAgAAABMAIBkAALIBACACAAAAEwAgGQAAsgEAIAMAAAAVACAgAACrAQAgIQAAsAEAIAEAAAAVACABAAAAEwAgBQsAAIcFACAmAACIBQAgJwAAiwUAICgAAIoFACApAACJBQAgCOwBAACNAwAw7QEAALkBABDuAQAAjQMAMO8BAQDhAgAhnwIBAOECACGgAgEA4QIAIaECAgCKAwAhogICAIoDACEDAAAAEwAgAQAAuAEAMCUAALkBACADAAAAEwAgAQAAFAAwAgAAFQAgAQAAABoAIAEAAAAaACADAAAAGAAgAQAAGQAwAgAAGgAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACAJBwAAvAQAIAkAAO0DACDvAQEAAAAB8wFAAAAAAfQBQAAAAAGcAgIAAAABnQIBAAAAAZ4CAQAAAAGfAgEAAAABARkAAMEBACAH7wEBAAAAAfMBQAAAAAH0AUAAAAABnAICAAAAAZ0CAQAAAAGeAgEAAAABnwIBAAAAAQEZAADDAQAwARkAAMMBADAJBwAAugQAIAkAAOsDACDvAQEArQMAIfMBQACuAwAh9AFAAK4DACGcAgIAzQMAIZ0CAQCzAwAhngIBAK0DACGfAgEArQMAIQIAAAAaACAZAADGAQAgB-8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZwCAgDNAwAhnQIBALMDACGeAgEArQMAIZ8CAQCtAwAhAgAAABgAIBkAAMgBACACAAAAGAAgGQAAyAEAIAMAAAAaACAgAADBAQAgIQAAxgEAIAEAAAAaACABAAAAGAAgBgsAAIIFACAmAACDBQAgJwAAhgUAICgAAIUFACApAACEBQAgnQIAAK8DACAK7AEAAIkDADDtAQAAzwEAEO4BAACJAwAw7wEBAOECACHzAUAA4gIAIfQBQADiAgAhnAICAIoDACGdAgEA7AIAIZ4CAQDhAgAhnwIBAOECACEDAAAAGAAgAQAAzgEAMCUAAM8BACADAAAAGAAgAQAAGQAwAgAAGgAgEAQAAIUDACAFAACGAwAgBgAAhwMAIAcAAIgDACDsAQAAgwMAMO0BAADVAQAQ7gEAAIMDADDvAQEAAAAB8wFAAOoCACH0AUAA6gIAIY0CAQD2AgAhlwIBAOkCACGYAgEAAAABmQIgAIQDACGaAgEA9gIAIZsCAQD2AgAhAQAAANIBACABAAAA0gEAIBAEAACFAwAgBQAAhgMAIAYAAIcDACAHAACIAwAg7AEAAIMDADDtAQAA1QEAEO4BAACDAwAw7wEBAOkCACHzAUAA6gIAIfQBQADqAgAhjQIBAPYCACGXAgEA6QIAIZgCAQDpAgAhmQIgAIQDACGaAgEA9gIAIZsCAQD2AgAhBwQAAP4EACAFAAD_BAAgBgAAgAUAIAcAAIEFACCNAgAArwMAIJoCAACvAwAgmwIAAK8DACADAAAA1QEAIAEAANYBADACAADSAQAgAwAAANUBACABAADWAQAwAgAA0gEAIAMAAADVAQAgAQAA1gEAMAIAANIBACANBAAA-gQAIAUAAPsEACAGAAD8BAAgBwAA_QQAIO8BAQAAAAHzAUAAAAAB9AFAAAAAAY0CAQAAAAGXAgEAAAABmAIBAAAAAZkCIAAAAAGaAgEAAAABmwIBAAAAAQEZAADaAQAgCe8BAQAAAAHzAUAAAAAB9AFAAAAAAY0CAQAAAAGXAgEAAAABmAIBAAAAAZkCIAAAAAGaAgEAAAABmwIBAAAAAQEZAADcAQAwARkAANwBADANBAAA1AQAIAUAANUEACAGAADWBAAgBwAA1wQAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIY0CAQCzAwAhlwIBAK0DACGYAgEArQMAIZkCIADTBAAhmgIBALMDACGbAgEAswMAIQIAAADSAQAgGQAA3wEAIAnvAQEArQMAIfMBQACuAwAh9AFAAK4DACGNAgEAswMAIZcCAQCtAwAhmAIBAK0DACGZAiAA0wQAIZoCAQCzAwAhmwIBALMDACECAAAA1QEAIBkAAOEBACACAAAA1QEAIBkAAOEBACADAAAA0gEAICAAANoBACAhAADfAQAgAQAAANIBACABAAAA1QEAIAYLAADQBAAgKAAA0gQAICkAANEEACCNAgAArwMAIJoCAACvAwAgmwIAAK8DACAM7AEAAP8CADDtAQAA6AEAEO4BAAD_AgAw7wEBAOECACHzAUAA4gIAIfQBQADiAgAhjQIBAOwCACGXAgEA4QIAIZgCAQDhAgAhmQIgAIADACGaAgEA7AIAIZsCAQDsAgAhAwAAANUBACABAADnAQAwJQAA6AEAIAMAAADVAQAgAQAA1gEAMAIAANIBACAPAwAA-AIAIBAAAP4CACDsAQAA_QIAMO0BAAALABDuAQAA_QIAMO8BAQAAAAHzAUAA6gIAIYICAQAAAAGNAgEA6QIAIY4CAQD2AgAhjwJAAPcCACGQAgEA9gIAIZECAQD2AgAhlQIBAOkCACGWAgEA6QIAIQEAAADrAQAgAQAAAOsBACAGAwAAjwQAIBAAAM8EACCOAgAArwMAII8CAACvAwAgkAIAAK8DACCRAgAArwMAIAMAAAALACABAADuAQAwAgAA6wEAIAMAAAALACABAADuAQAwAgAA6wEAIAMAAAALACABAADuAQAwAgAA6wEAIAwDAADNBAAgEAAAzgQAIO8BAQAAAAHzAUAAAAABggIBAAAAAY0CAQAAAAGOAgEAAAABjwJAAAAAAZACAQAAAAGRAgEAAAABlQIBAAAAAZYCAQAAAAEBGQAA8gEAIArvAQEAAAAB8wFAAAAAAYICAQAAAAGNAgEAAAABjgIBAAAAAY8CQAAAAAGQAgEAAAABkQIBAAAAAZUCAQAAAAGWAgEAAAABARkAAPQBADABGQAA9AEAMAwDAACWBAAgEAAAlwQAIO8BAQCtAwAh8wFAAK4DACGCAgEArQMAIY0CAQCtAwAhjgIBALMDACGPAkAAtAMAIZACAQCzAwAhkQIBALMDACGVAgEArQMAIZYCAQCtAwAhAgAAAOsBACAZAAD3AQAgCu8BAQCtAwAh8wFAAK4DACGCAgEArQMAIY0CAQCtAwAhjgIBALMDACGPAkAAtAMAIZACAQCzAwAhkQIBALMDACGVAgEArQMAIZYCAQCtAwAhAgAAAAsAIBkAAPkBACACAAAACwAgGQAA-QEAIAMAAADrAQAgIAAA8gEAICEAAPcBACABAAAA6wEAIAEAAAALACAHCwAAkwQAICgAAJUEACApAACUBAAgjgIAAK8DACCPAgAArwMAIJACAACvAwAgkQIAAK8DACAN7AEAAPwCADDtAQAAgAIAEO4BAAD8AgAw7wEBAOECACHzAUAA4gIAIYICAQDhAgAhjQIBAOECACGOAgEA7AIAIY8CQADtAgAhkAIBAOwCACGRAgEA7AIAIZUCAQDhAgAhlgIBAOECACEDAAAACwAgAQAA_wEAMCUAAIACACADAAAACwAgAQAA7gEAMAIAAOsBACAPAwAA-AIAIAwAAPkCACANAAD6AgAgDwAA-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-gEBAAAAAfsBAQAAAAH8AQEA5gIAIf0BAQAAAAH-AQEAAAAB_wEBAAAAAQsLAADkAgAgKAAA5QIAICkAAOUCACD1AUAAAAAB9gFAAAAABPcBQAAAAAT4AUAAAAAB-QFAAAAAAfoBQAAAAAH7AUAAAAAB_AFAAOMCACELCwAA5AIAICgAAOUCACApAADlAgAg9QFAAAAAAfYBQAAAAAT3AUAAAAAE-AFAAAAAAfkBQAAAAAH6AUAAAAAB-wFAAAAAAfwBQADjAgAhCPUBAgAAAAH2AQIAAAAE9wECAAAABPgBAgAAAAH5AQIAAAAB-gECAAAAAfsBAgAAAAH8AQIA5AIAIQj1AUAAAAAB9gFAAAAABPcBQAAAAAT4AUAAAAAB-QFAAAAAAfoBQAAAAAH7AUAAAAAB_AFAAOUCACEOCwAA5AIAICgAAOcCACApAADnAgAg9QEBAAAAAfYBAQAAAAT3AQEAAAAE-AEBAAAAAfkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQDmAgAh_QEBAAAAAf4BAQAAAAH_AQEAAAABC_UBAQAAAAH2AQEAAAAE9wEBAAAABPgBAQAAAAH5AQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEA5wIAIf0BAQAAAAH-AQEAAAAB_wEBAAAAAQnsAQAA6AIAMO0BAADKAgAQ7gEAAOgCADDvAQEA6QIAIfABAQDpAgAh8QEBAOkCACHyAUAA6gIAIfMBQADqAgAh9AFAAOoCACEL9QEBAAAAAfYBAQAAAAT3AQEAAAAE-AEBAAAAAfkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQDnAgAh_QEBAAAAAf4BAQAAAAH_AQEAAAABCPUBQAAAAAH2AUAAAAAE9wFAAAAABPgBQAAAAAH5AUAAAAAB-gFAAAAAAfsBQAAAAAH8AUAA5QIAIRDsAQAA6wIAMO0BAADEAgAQ7gEAAOsCADDvAQEA4QIAIfMBQADiAgAh9AFAAOICACGAAgEA4QIAIYECAQDhAgAhggIBAOECACGDAgEA7AIAIYQCAQDsAgAhhQIBAOwCACGGAkAA7QIAIYcCQADtAgAhiAIBAOwCACGJAgEA7AIAIQ4LAADvAgAgKAAA8gIAICkAAPICACD1AQEAAAAB9gEBAAAABfcBAQAAAAX4AQEAAAAB-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAPECACH9AQEAAAAB_gEBAAAAAf8BAQAAAAELCwAA7wIAICgAAPACACApAADwAgAg9QFAAAAAAfYBQAAAAAX3AUAAAAAF-AFAAAAAAfkBQAAAAAH6AUAAAAAB-wFAAAAAAfwBQADuAgAhCwsAAO8CACAoAADwAgAgKQAA8AIAIPUBQAAAAAH2AUAAAAAF9wFAAAAABfgBQAAAAAH5AUAAAAAB-gFAAAAAAfsBQAAAAAH8AUAA7gIAIQj1AQIAAAAB9gECAAAABfcBAgAAAAX4AQIAAAAB-QECAAAAAfoBAgAAAAH7AQIAAAAB_AECAO8CACEI9QFAAAAAAfYBQAAAAAX3AUAAAAAF-AFAAAAAAfkBQAAAAAH6AUAAAAAB-wFAAAAAAfwBQADwAgAhDgsAAO8CACAoAADyAgAgKQAA8gIAIPUBAQAAAAH2AQEAAAAF9wEBAAAABfgBAQAAAAH5AQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEA8QIAIf0BAQAAAAH-AQEAAAAB_wEBAAAAAQv1AQEAAAAB9gEBAAAABfcBAQAAAAX4AQEAAAAB-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAPICACH9AQEAAAAB_gEBAAAAAf8BAQAAAAEL7AEAAPMCADDtAQAArgIAEO4BAADzAgAw7wEBAOECACHyAUAA4gIAIfMBQADiAgAh9AFAAOICACGCAgEA4QIAIYoCAQDhAgAhiwIBAOwCACGMAgEA7AIAIQvsAQAA9AIAMO0BAACYAgAQ7gEAAPQCADDvAQEA4QIAIfMBQADiAgAhggIBAOECACGNAgEA4QIAIY4CAQDsAgAhjwJAAO0CACGQAgEA7AIAIZECAQDsAgAhDwMAAPgCACAMAAD5AgAgDQAA-gIAIA8AAPsCACDsAQAA9QIAMO0BAAANABDuAQAA9QIAMO8BAQDpAgAh8wFAAOoCACGCAgEA6QIAIY0CAQDpAgAhjgIBAPYCACGPAkAA9wIAIZACAQD2AgAhkQIBAPYCACEL9QEBAAAAAfYBAQAAAAX3AQEAAAAF-AEBAAAAAfkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQDyAgAh_QEBAAAAAf4BAQAAAAH_AQEAAAABCPUBQAAAAAH2AUAAAAAF9wFAAAAABfgBQAAAAAH5AUAAAAAB-gFAAAAAAfsBQAAAAAH8AUAA8AIAIRIEAACFAwAgBQAAhgMAIAYAAIcDACAHAACIAwAg7AEAAIMDADDtAQAA1QEAEO4BAACDAwAw7wEBAOkCACHzAUAA6gIAIfQBQADqAgAhjQIBAPYCACGXAgEA6QIAIZgCAQDpAgAhmQIgAIQDACGaAgEA9gIAIZsCAQD2AgAhrwIAANUBACCwAgAA1QEAIAOSAgAADwAgkwIAAA8AIJQCAAAPACADkgIAABgAIJMCAAAYACCUAgAAGAAgA5ICAAAcACCTAgAAHAAglAIAABwAIA3sAQAA_AIAMO0BAACAAgAQ7gEAAPwCADDvAQEA4QIAIfMBQADiAgAhggIBAOECACGNAgEA4QIAIY4CAQDsAgAhjwJAAO0CACGQAgEA7AIAIZECAQDsAgAhlQIBAOECACGWAgEA4QIAIQ8DAAD4AgAgEAAA_gIAIOwBAAD9AgAw7QEAAAsAEO4BAAD9AgAw7wEBAOkCACHzAUAA6gIAIYICAQDpAgAhjQIBAOkCACGOAgEA9gIAIY8CQAD3AgAhkAIBAPYCACGRAgEA9gIAIZUCAQDpAgAhlgIBAOkCACEDkgIAACoAIJMCAAAqACCUAgAAKgAgDOwBAAD_AgAw7QEAAOgBABDuAQAA_wIAMO8BAQDhAgAh8wFAAOICACH0AUAA4gIAIY0CAQDsAgAhlwIBAOECACGYAgEA4QIAIZkCIACAAwAhmgIBAOwCACGbAgEA7AIAIQULAADkAgAgKAAAggMAICkAAIIDACD1ASAAAAAB_AEgAIEDACEFCwAA5AIAICgAAIIDACApAACCAwAg9QEgAAAAAfwBIACBAwAhAvUBIAAAAAH8ASAAggMAIRAEAACFAwAgBQAAhgMAIAYAAIcDACAHAACIAwAg7AEAAIMDADDtAQAA1QEAEO4BAACDAwAw7wEBAOkCACHzAUAA6gIAIfQBQADqAgAhjQIBAPYCACGXAgEA6QIAIZgCAQDpAgAhmQIgAIQDACGaAgEA9gIAIZsCAQD2AgAhAvUBIAAAAAH8ASAAggMAIQOSAgAAAwAgkwIAAAMAIJQCAAADACADkgIAAAcAIJMCAAAHACCUAgAABwAgEQMAAPgCACAQAAD-AgAg7AEAAP0CADDtAQAACwAQ7gEAAP0CADDvAQEA6QIAIfMBQADqAgAhggIBAOkCACGNAgEA6QIAIY4CAQD2AgAhjwJAAPcCACGQAgEA9gIAIZECAQD2AgAhlQIBAOkCACGWAgEA6QIAIa8CAAALACCwAgAACwAgEQMAAPgCACAMAAD5AgAgDQAA-gIAIA8AAPsCACDsAQAA9QIAMO0BAAANABDuAQAA9QIAMO8BAQDpAgAh8wFAAOoCACGCAgEA6QIAIY0CAQDpAgAhjgIBAPYCACGPAkAA9wIAIZACAQD2AgAhkQIBAPYCACGvAgAADQAgsAIAAA0AIArsAQAAiQMAMO0BAADPAQAQ7gEAAIkDADDvAQEA4QIAIfMBQADiAgAh9AFAAOICACGcAgIAigMAIZ0CAQDsAgAhngIBAOECACGfAgEA4QIAIQ0LAADkAgAgJgAAjAMAICcAAOQCACAoAADkAgAgKQAA5AIAIPUBAgAAAAH2AQIAAAAE9wECAAAABPgBAgAAAAH5AQIAAAAB-gECAAAAAfsBAgAAAAH8AQIAiwMAIQ0LAADkAgAgJgAAjAMAICcAAOQCACAoAADkAgAgKQAA5AIAIPUBAgAAAAH2AQIAAAAE9wECAAAABPgBAgAAAAH5AQIAAAAB-gECAAAAAfsBAgAAAAH8AQIAiwMAIQj1AQgAAAAB9gEIAAAABPcBCAAAAAT4AQgAAAAB-QEIAAAAAfoBCAAAAAH7AQgAAAAB_AEIAIwDACEI7AEAAI0DADDtAQAAuQEAEO4BAACNAwAw7wEBAOECACGfAgEA4QIAIaACAQDhAgAhoQICAIoDACGiAgIAigMAIQnsAQAAjgMAMO0BAACjAQAQ7gEAAI4DADDvAQEA4QIAIfQBQADiAgAhmwIAAI8DpQIingIBAOECACGjAgIAigMAIaUCQADiAgAhBwsAAOQCACAoAACRAwAgKQAAkQMAIPUBAAAApQIC9gEAAAClAgj3AQAAAKUCCPwBAACQA6UCIgcLAADkAgAgKAAAkQMAICkAAJEDACD1AQAAAKUCAvYBAAAApQII9wEAAAClAgj8AQAAkAOlAiIE9QEAAAClAgL2AQAAAKUCCPcBAAAApQII_AEAAJEDpQIiCOwBAACSAwAw7QEAAI0BABDuAQAAkgMAMO8BAQDhAgAhnwIBAOECACGhAgIAigMAIaICAgCKAwAhpgIBAOECACEJ7AEAAJMDADDtAQAAdwAQ7gEAAJMDADDvAQEA4QIAIfMBQADiAgAh9AFAAOICACGeAgEA4QIAIaMCAgCKAwAhpwIBAOECACEI7AEAAJQDADDtAQAAYQAQ7gEAAJQDADDvAQEA4QIAIfMBQADiAgAh9AFAAOICACGXAgEA4QIAIagCAQDsAgAhCRAAAP4CACDsAQAAlQMAMO0BAABOABDuAQAAlQMAMO8BAQDpAgAh8wFAAOoCACH0AUAA6gIAIZcCAQDpAgAhqAIBAPYCACEN7AEAAJYDADDtAQAASAAQ7gEAAJYDADDvAQEA4QIAIfMBQADiAgAh9AFAAOICACGXAgEA4QIAIaICAgCKAwAhqQIBAOECACGqAgIAigMAIasCAQDsAgAhrAIBAOECACGtAgEA4QIAIRIGAACZAwAgDQAA-gIAIBEAAJoDACASAACbAwAgEwAAnAMAIOwBAACXAwAw7QEAACoAEO4BAACXAwAw7wEBAOkCACHzAUAA6gIAIfQBQADqAgAhlwIBAOkCACGiAgIAmAMAIakCAQDpAgAhqgICAJgDACGrAgEA9gIAIawCAQDpAgAhrQIBAOkCACEI9QECAAAAAfYBAgAAAAT3AQIAAAAE-AECAAAAAfkBAgAAAAH6AQIAAAAB-wECAAAAAfwBAgDkAgAhEQMAAPgCACAQAAD-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_QUAMAsJAACgAwAgDgAAnwMAIOwBAACeAwAw7QEAACAAEO4BAACeAwAw7wEBAAAAAZ8CAQDpAgAhoQICAJgDACGiAgIAmAMAIaYCAQDpAgAhrgIAAJ0DACACAAAAIgAgGQAA2gMAIAIAAADYAwAgGQAA2QMAIAjsAQAA1wMAMO0BAADYAwAQ7gEAANcDADDvAQEA6QIAIZ8CAQDpAgAhoQICAJgDACGiAgIAmAMAIaYCAQDpAgAhCOwBAADXAwAw7QEAANgDABDuAQAA1wMAMO8BAQDpAgAhnwIBAOkCACGhAgIAmAMAIaICAgCYAwAhpgIBAOkCACEE7wEBAK0DACGfAgEArQMAIaECAgDNAwAhogICAM0DACEFCQAA2wMAIO8BAQCtAwAhnwIBAK0DACGhAgIAzQMAIaICAgDNAwAhBSAAAPgFACAhAAD7BQAgsQIAAPkFACCyAgAA-gUAILcCAAABACAFCQAA3QMAIO8BAQAAAAGfAgEAAAABoQICAAAAAaICAgAAAAEDIAAA-AUAILECAAD5BQAgtwIAAAEAIAYKAADfAwAg7wEBAAAAAfMBQAAAAAH0AUAAAAABowICAAAAAacCAQAAAAEEIAAA0AMAMLECAADRAwAwswIAANMDACC3AgAA1AMAMAcJAADtAwAg7wEBAAAAAfMBQAAAAAH0AUAAAAABnAICAAAAAZ0CAQAAAAGfAgEAAAABAgAAABoAICAAAOwDACADAAAAGgAgIAAA7AMAICEAAOoDACABGQAA9wUAMAwHAACiAwAgCQAAoAMAIOwBAACjAwAw7QEAABgAEO4BAACjAwAw7wEBAAAAAfMBQADqAgAh9AFAAOoCACGcAgIAmAMAIZ0CAQD2AgAhngIBAOkCACGfAgEA6QIAIQIAAAAaACAZAADqAwAgAgAAAOgDACAZAADpAwAgCuwBAADnAwAw7QEAAOgDABDuAQAA5wMAMO8BAQDpAgAh8wFAAOoCACH0AUAA6gIAIZwCAgCYAwAhnQIBAPYCACGeAgEA6QIAIZ8CAQDpAgAhCuwBAADnAwAw7QEAAOgDABDuAQAA5wMAMO8BAQDpAgAh8wFAAOoCACH0AUAA6gIAIZwCAgCYAwAhnQIBAPYCACGeAgEA6QIAIZ8CAQDpAgAhBu8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZwCAgDNAwAhnQIBALMDACGfAgEArQMAIQcJAADrAwAg7wEBAK0DACHzAUAArgMAIfQBQACuAwAhnAICAM0DACGdAgEAswMAIZ8CAQCtAwAhBSAAAPIFACAhAAD1BQAgsQIAAPMFACCyAgAA9AUAILcCAAABACAHCQAA7QMAIO8BAQAAAAHzAUAAAAAB9AFAAAAAAZwCAgAAAAGdAgEAAAABnwIBAAAAAQMgAADyBQAgsQIAAPMFACC3AgAAAQAgBgoAAIoEACDvAQEAAAAB9AFAAAAAAZsCAAAApQICowICAAAAAaUCQAAAAAECAAAAEQAgIAAAiQQAIAMAAAARACAgAACJBAAgIQAA-QMAIAEZAADxBQAwCwcAAKIDACAKAACbAwAg7AEAAKYDADDtAQAADwAQ7gEAAKYDADDvAQEAAAAB9AFAAOoCACGbAgAApwOlAiKeAgEA6QIAIaMCAgCYAwAhpQJAAOoCACECAAAAEQAgGQAA-QMAIAIAAAD2AwAgGQAA9wMAIAnsAQAA9QMAMO0BAAD2AwAQ7gEAAPUDADDvAQEA6QIAIfQBQADqAgAhmwIAAKcDpQIingIBAOkCACGjAgIAmAMAIaUCQADqAgAhCewBAAD1AwAw7QEAAPYDABDuAQAA9QMAMO8BAQDpAgAh9AFAAOoCACGbAgAApwOlAiKeAgEA6QIAIaMCAgCYAwAhpQJAAOoCACEF7wEBAK0DACH0AUAArgMAIZsCAAD4A6UCIqMCAgDNAwAhpQJAAK4DACEBtAIAAAClAgIGCgAA-gMAIO8BAQCtAwAh9AFAAK4DACGbAgAA-AOlAiKjAgIAzQMAIaUCQACuAwAhCyAAAPsDADAhAACABAAwsQIAAPwDADCyAgAA_QMAMLMCAAD-AwAgtAIAAP8DADC1AgAA_wMAMLYCAAD_AwAwtwIAAP8DADC4AgAAgQQAMLkCAACCBAAwBQkAAIgEACDvAQEAAAABnwIBAAAAAaECAgAAAAGiAgIAAAABAgAAABUAICAAAIcEACADAAAAFQAgIAAAhwQAICEAAIUEACABGQAA8AUAMAoIAAClAwAgCQAAoAMAIOwBAACkAwAw7QEAABMAEO4BAACkAwAw7wEBAAAAAZ8CAQDpAgAhoAIBAOkCACGhAgIAmAMAIaICAgCYAwAhAgAAABUAIBkAAIUEACACAAAAgwQAIBkAAIQEACAI7AEAAIIEADDtAQAAgwQAEO4BAACCBAAw7wEBAOkCACGfAgEA6QIAIaACAQDpAgAhoQICAJgDACGiAgIAmAMAIQjsAQAAggQAMO0BAACDBAAQ7gEAAIIEADDvAQEA6QIAIZ8CAQDpAgAhoAIBAOkCACGhAgIAmAMAIaICAgCYAwAhBO8BAQCtAwAhnwIBAK0DACGhAgIAzQMAIaICAgDNAwAhBQkAAIYEACDvAQEArQMAIZ8CAQCtAwAhoQICAM0DACGiAgIAzQMAIQUgAADrBQAgIQAA7gUAILECAADsBQAgsgIAAO0FACC3AgAAAQAgBQkAAIgEACDvAQEAAAABnwIBAAAAAaECAgAAAAGiAgIAAAABAyAAAOsFACCxAgAA7AUAILcCAAABACAGCgAAigQAIO8BAQAAAAH0AUAAAAABmwIAAAClAgKjAgIAAAABpQJAAAAAAQQgAAD7AwAwsQIAAPwDADCzAgAA_gMAILcCAAD_AwAwAyAAAOkFACCxAgAA6gUAILcCAADSAQAgBCAAAO4DADCxAgAA7wMAMLMCAADxAwAgtwIAAPIDADAEIAAA4AMAMLECAADhAwAwswIAAOMDACC3AgAA5AMAMAQgAADDAwAwsQIAAMQDADCzAgAAxgMAILcCAADHAwAwBwQAAP4EACAFAAD_BAAgBgAAgAUAIAcAAIEFACCNAgAArwMAIJoCAACvAwAgmwIAAK8DACAAAAAAAAAFIAAAzAUAICEAAOcFACCxAgAAzQUAILICAADmBQAgtwIAANIBACALIAAAmAQAMCEAAJ0EADCxAgAAmQQAMLICAACaBAAwswIAAJsEACC0AgAAnAQAMLUCAACcBAAwtgIAAJwEADC3AgAAnAQAMLgCAACeBAAwuQIAAJ8EADANDQAAywQAIBEAAMkEACASAADKBAAgEwAAzAQAIO8BAQAAAAHzAUAAAAAB9AFAAAAAAZcCAQAAAAGiAgIAAAABqQIBAAAAAaoCAgAAAAGrAgEAAAABrQIBAAAAAQIAAAABACAgAADIBAAgAwAAAAEAICAAAMgEACAhAACiBAAgARkAAOUFADASBgAAmQMAIA0AAPoCACARAACaAwAgEgAAmwMAIBMAAJwDACDsAQAAlwMAMO0BAAAqABDuAQAAlwMAMO8BAQAAAAHzAUAA6gIAIfQBQADqAgAhlwIBAOkCACGiAgIAmAMAIakCAQDpAgAhqgICAJgDACGrAgEA9gIAIawCAQDpAgAhrQIBAOkCACECAAAAAQAgGQAAogQAIAIAAACgBAAgGQAAoQQAIA3sAQAAnwQAMO0BAACgBAAQ7gEAAJ8EADDvAQEA6QIAIfMBQADqAgAh9AFAAOoCACGXAgEA6QIAIaICAgCYAwAhqQIBAOkCACGqAgIAmAMAIasCAQD2AgAhrAIBAOkCACGtAgEA6QIAIQ3sAQAAnwQAMO0BAACgBAAQ7gEAAJ8EADDvAQEA6QIAIfMBQADqAgAh9AFAAOoCACGXAgEA6QIAIaICAgCYAwAhqQIBAOkCACGqAgIAmAMAIasCAQD2AgAhrAIBAOkCACGtAgEA6QIAIQnvAQEArQMAIfMBQACuAwAh9AFAAK4DACGXAgEArQMAIaICAgDNAwAhqQIBAK0DACGqAgIAzQMAIasCAQCzAwAhrQIBAK0DACENDQAApQQAIBEAAKMEACASAACkBAAgEwAApgQAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZcCAQCtAwAhogICAM0DACGpAgEArQMAIaoCAgDNAwAhqwIBALMDACGtAgEArQMAIQUgAADOBQAgIQAA4wUAILECAADPBQAgsgIAAOIFACC3AgAASwAgCyAAAL0EADAhAADBBAAwsQIAAL4EADCyAgAAvwQAMLMCAADABAAgtAIAAP8DADC1AgAA_wMAMLYCAAD_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EAICAAAKwFACADAAAAAQAgIAAArAUAICEAAKoFACABGQAAvwUAMAIAAAABACAZAACqBQAgAgAAAKAEACAZAACpBQAgCe8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZcCAQCtAwAhogICAM0DACGpAgEArQMAIaoCAgDNAwAhqwIBALMDACGsAgEArQMAIQ0GAACrBQAgDQAApQQAIBIAAKQEACATAACmBAAg7wEBAK0DACHzAUAArgMAIfQBQACuAwAhlwIBAK0DACGiAgIAzQMAIakCAQCtAwAhqgICAM0DACGrAgEAswMAIawCAQCtAwAhBSAAALoFACAhAAC9BQAgsQIAALsFACCyAgAAvAUAILcCAADrAQAgDQYAAK0FACANAADLBAAgEgAAygQAIBMAAMwEACDvAQEAAAAB8wFAAAAAAfQBQAAAAAGXAgEAAAABogICAAAAAakCAQAAAAGqAgIAAAABqwIBAAAAAawCAQAAAAEDIAAAugUAILECAAC7BQAgtwIAAOsBACAEIAAAowUAMLECAACkBQAwswIAAKYFACC3AgAAnAQAMAAAAAAAAhAAAM8EACCoAgAArwMAIAAAAgcAAIEFACAKAAC2BQAgBgYAAIAFACANAACRBAAgEQAAtAUAIBIAALUFACATAAC2BQAgqwIAAK8DACACBwAAgQUAIAoAALUFACALAwAAzQQAIO8BAQAAAAHzAUAAAAABggIBAAAAAY0CAQAAAAGOAgEAAAABjwJAAAAAAZACAQAAAAGRAgEAAAABlQIBAAAAAZYCAQAAAAECAAAA6wEAICAAALoFACADAAAACwAgIAAAugUAICEAAL4FACANAAAACwAgAwAAlgQAIBkAAL4FACDvAQEArQMAIfMBQACuAwAhggIBAK0DACGNAgEArQMAIY4CAQCzAwAhjwJAALQDACGQAgEAswMAIZECAQCzAwAhlQIBAK0DACGWAgEArQMAIQsDAACWBAAg7wEBAK0DACHzAUAArgMAIYICAQCtAwAhjQIBAK0DACGOAgEAswMAIY8CQAC0AwAhkAIBALMDACGRAgEAswMAIZUCAQCtAwAhlgIBAK0DACEJ7wEBAAAAAfMBQAAAAAH0AUAAAAABlwIBAAAAAaICAgAAAAGpAgEAAAABqgICAAAAAasCAQAAAAGsAgEAAAABCwMAAIsEACAMAACMBAAgDQAAjQQAIO8BAQAAAAHzAUAAAAABggIBAAAAAY0CAQAAAAGOAgEAAAABjwJAAAAAAZACAQAAAAGRAgEAAAABAgAAAIMCACAgAADABQAgAwAAAA0AICAAAMAFACAhAADEBQAgDQAAAA0AIAMAAL8DACAMAADAAwAgDQAAwQMAIBkAAMQFACDvAQEArQMAIfMBQACuAwAhggIBAK0DACGNAgEArQMAIY4CAQCzAwAhjwJAALQDACGQAgEAswMAIZECAQCzAwAhCwMAAL8DACAMAADAAwAgDQAAwQMAIO8BAQCtAwAh8wFAAK4DACGCAgEArQMAIY0CAQCtAwAhjgIBALMDACGPAkAAtAMAIZACAQCzAwAhkQIBALMDACELAwAAiwQAIA0AAI0EACAPAACOBAAg7wEBAAAAAfMBQAAAAAGCAgEAAAABjQIBAAAAAY4CAQAAAAGPAkAAAAABkAIBAAAAAZECAQAAAAECAAAAgwIAICAAAMUFACADAAAADQAgIAAAxQUAICEAAMkFACANAAAADQAgAwAAvwMAIA0AAMEDACAPAADCAwAgGQAAyQUAIO8BAQCtAwAh8wFAAK4DACGCAgEArQMAIY0CAQCtAwAhjgIBALMDACGPAkAAtAMAIZACAQCzAwAhkQIBALMDACELAwAAvwMAIA0AAMEDACAPAADCAwAg7wEBAK0DACHzAUAArgMAIYICAQCtAwAhjQIBAK0DACGOAgEAswMAIY8CQAC0AwAhkAIBALMDACGRAgEAswMAIQfvAQEAAAAB8gFAAAAAAfMBQAAAAAH0AUAAAAABigIBAAAAAYsCAQAAAAGMAgEAAAABDO8BAQAAAAHzAUAAAAAB9AFAAAAAAYACAQAAAAGBAgEAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABiQIBAAAAAQwEAAD6BAAgBQAA-wQAIAcAAP0EACDvAQEAAAAB8wFAAAAAAfQBQAAAAAGNAgEAAAABlwIBAAAAAZgCAQAAAAGZAiAAAAABmgIBAAAAAZsCAQAAAAECAAAA0gEAICAAAMwFACAF7wEBAAAAAfMBQAAAAAH0AUAAAAABlwIBAAAAAagCAQAAAAECAAAASwAgIAAAzgUAIAcHAACSBQAg7wEBAAAAAfQBQAAAAAGbAgAAAKUCAp4CAQAAAAGjAgIAAAABpQJAAAAAAQIAAAARACAgAADQBQAgAwAAAA8AICAAANAFACAhAADUBQAgCQAAAA8AIAcAAJEFACAZAADUBQAg7wEBAK0DACH0AUAArgMAIZsCAAD4A6UCIp4CAQCtAwAhowICAM0DACGlAkAArgMAIQcHAACRBQAg7wEBAK0DACH0AUAArgMAIZsCAAD4A6UCIp4CAQCtAwAhowICAM0DACGlAkAArgMAIQTvAQEAAAABoAIBAAAAAaECAgAAAAGiAgIAAAABCwMAAIsEACAMAACMBAAgDwAAjgQAIO8BAQAAAAHzAUAAAAABggIBAAAAAY0CAQAAAAGOAgEAAAABjwJAAAAAAZACAQAAAAGRAgEAAAABAgAAAIMCACAgAADWBQAgAwAAAA0AICAAANYFACAhAADaBQAgDQAAAA0AIAMAAL8DACAMAADAAwAgDwAAwgMAIBkAANoFACDvAQEArQMAIfMBQACuAwAhggIBAK0DACGNAgEArQMAIY4CAQCzAwAhjwJAALQDACGQAgEAswMAIZECAQCzAwAhCwMAAL8DACAMAADAAwAgDwAAwgMAIO8BAQCtAwAh8wFAAK4DACGCAgEArQMAIY0CAQCtAwAhjgIBALMDACGPAkAAtAMAIZACAQCzAwAhkQIBALMDACEG7wEBAAAAAfMBQAAAAAH0AUAAAAABnAICAAAAAZ0CAQAAAAGeAgEAAAABBwcAAJ4FACDvAQEAAAAB8wFAAAAAAfQBQAAAAAGeAgEAAAABowICAAAAAacCAQAAAAECAAAAHgAgIAAA3AUAIAMAAAAcACAgAADcBQAgIQAA4AUAIAkAAAAcACAHAACdBQAgGQAA4AUAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZ4CAQCtAwAhowICAM0DACGnAgEArQMAIQcHAACdBQAg7wEBAK0DACHzAUAArgMAIfQBQACuAwAhngIBAK0DACGjAgIAzQMAIacCAQCtAwAhBO8BAQAAAAGhAgIAAAABogICAAAAAaYCAQAAAAEDAAAATgAgIAAAzgUAICEAAOQFACAHAAAATgAgGQAA5AUAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZcCAQCtAwAhqAIBALMDACEF7wEBAK0DACHzAUAArgMAIfQBQACuAwAhlwIBAK0DACGoAgEAswMAIQnvAQEAAAAB8wFAAAAAAfQBQAAAAAGXAgEAAAABogICAAAAAakCAQAAAAGqAgIAAAABqwIBAAAAAa0CAQAAAAEDAAAA1QEAICAAAMwFACAhAADoBQAgDgAAANUBACAEAADUBAAgBQAA1QQAIAcAANcEACAZAADoBQAg7wEBAK0DACHzAUAArgMAIfQBQACuAwAhjQIBALMDACGXAgEArQMAIZgCAQCtAwAhmQIgANMEACGaAgEAswMAIZsCAQCzAwAhDAQAANQEACAFAADVBAAgBwAA1wQAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIY0CAQCzAwAhlwIBAK0DACGYAgEArQMAIZkCIADTBAAhmgIBALMDACGbAgEAswMAIQwEAAD6BAAgBQAA-wQAIAYAAPwEACDvAQEAAAAB8wFAAAAAAfQBQAAAAAGNAgEAAAABlwIBAAAAAZgCAQAAAAGZAiAAAAABmgIBAAAAAZsCAQAAAAECAAAA0gEAICAAAOkFACAOBgAArQUAIA0AAMsEACARAADJBAAgEwAAzAQAIO8BAQAAAAHzAUAAAAAB9AFAAAAAAZcCAQAAAAGiAgIAAAABqQIBAAAAAaoCAgAAAAGrAgEAAAABrAIBAAAAAa0CAQAAAAECAAAAAQAgIAAA6wUAIAMAAAAqACAgAADrBQAgIQAA7wUAIBAAAAAqACAGAACrBQAgDQAApQQAIBEAAKMEACATAACmBAAgGQAA7wUAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZcCAQCtAwAhogICAM0DACGpAgEArQMAIaoCAgDNAwAhqwIBALMDACGsAgEArQMAIa0CAQCtAwAhDgYAAKsFACANAAClBAAgEQAAowQAIBMAAKYEACDvAQEArQMAIfMBQACuAwAh9AFAAK4DACGXAgEArQMAIaICAgDNAwAhqQIBAK0DACGqAgIAzQMAIasCAQCzAwAhrAIBAK0DACGtAgEArQMAIQTvAQEAAAABnwIBAAAAAaECAgAAAAGiAgIAAAABBe8BAQAAAAH0AUAAAAABmwIAAAClAgKjAgIAAAABpQJAAAAAAQ4GAACtBQAgEQAAyQQAIBIAAMoEACATAADMBAAg7wEBAAAAAfMBQAAAAAH0AUAAAAABlwIBAAAAAaICAgAAAAGpAgEAAAABqgICAAAAAasCAQAAAAGsAgEAAAABrQIBAAAAAQIAAAABACAgAADyBQAgAwAAACoAICAAAPIFACAhAAD2BQAgEAAAACoAIAYAAKsFACARAACjBAAgEgAApAQAIBMAAKYEACAZAAD2BQAg7wEBAK0DACHzAUAArgMAIfQBQACuAwAhlwIBAK0DACGiAgIAzQMAIakCAQCtAwAhqgICAM0DACGrAgEAswMAIawCAQCtAwAhrQIBAK0DACEOBgAAqwUAIBEAAKMEACASAACkBAAgEwAApgQAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZcCAQCtAwAhogICAM0DACGpAgEArQMAIaoCAgDNAwAhqwIBALMDACGsAgEArQMAIa0CAQCtAwAhBu8BAQAAAAHzAUAAAAAB9AFAAAAAAZwCAgAAAAGdAgEAAAABnwIBAAAAAQ4GAACtBQAgDQAAywQAIBEAAMkEACASAADKBAAg7wEBAAAAAfMBQAAAAAH0AUAAAAABlwIBAAAAAaICAgAAAAGpAgEAAAABqgICAAAAAasCAQAAAAGsAgEAAAABrQIBAAAAAQIAAAABACAgAAD4BQAgAwAAACoAICAAAPgFACAhAAD8BQAgEAAAACoAIAYAAKsFACANAAClBAAgEQAAowQAIBIAAKQEACAZAAD8BQAg7wEBAK0DACHzAUAArgMAIfQBQACuAwAhlwIBAK0DACGiAgIAzQMAIakCAQCtAwAhqgICAM0DACGrAgEAswMAIawCAQCtAwAhrQIBAK0DACEOBgAAqwUAIA0AAKUEACARAACjBAAgEgAApAQAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIZcCAQCtAwAhogICAM0DACGpAgEArQMAIaoCAgDNAwAhqwIBALMDACGsAgEArQMAIa0CAQCtAwAhBO8BAQAAAAGfAgEAAAABoQICAAAAAaICAgAAAAEF7wEBAAAAAfMBQAAAAAH0AUAAAAABowICAAAAAacCAQAAAAEDAAAA1QEAICAAAOkFACAhAACBBgAgDgAAANUBACAEAADUBAAgBQAA1QQAIAYAANYEACAZAACBBgAg7wEBAK0DACHzAUAArgMAIfQBQACuAwAhjQIBALMDACGXAgEArQMAIZgCAQCtAwAhmQIgANMEACGaAgEAswMAIZsCAQCzAwAhDAQAANQEACAFAADVBAAgBgAA1gQAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIY0CAQCzAwAhlwIBAK0DACGYAgEArQMAIZkCIADTBAAhmgIBALMDACGbAgEAswMAIQwFAAD7BAAgBgAA_AQAIAcAAP0EACDvAQEAAAAB8wFAAAAAAfQBQAAAAAGNAgEAAAABlwIBAAAAAZgCAQAAAAGZAiAAAAABmgIBAAAAAZsCAQAAAAECAAAA0gEAICAAAIIGACADAAAA1QEAICAAAIIGACAhAACGBgAgDgAAANUBACAFAADVBAAgBgAA1gQAIAcAANcEACAZAACGBgAg7wEBAK0DACHzAUAArgMAIfQBQACuAwAhjQIBALMDACGXAgEArQMAIZgCAQCtAwAhmQIgANMEACGaAgEAswMAIZsCAQCzAwAhDAUAANUEACAGAADWBAAgBwAA1wQAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIY0CAQCzAwAhlwIBAK0DACGYAgEArQMAIZkCIADTBAAhmgIBALMDACGbAgEAswMAIQwEAAD6BAAgBgAA_AQAIAcAAP0EACDvAQEAAAAB8wFAAAAAAfQBQAAAAAGNAgEAAAABlwIBAAAAAZgCAQAAAAGZAiAAAAABmgIBAAAAAZsCAQAAAAECAAAA0gEAICAAAIcGACADAAAA1QEAICAAAIcGACAhAACLBgAgDgAAANUBACAEAADUBAAgBgAA1gQAIAcAANcEACAZAACLBgAg7wEBAK0DACHzAUAArgMAIfQBQACuAwAhjQIBALMDACGXAgEArQMAIZgCAQCtAwAhmQIgANMEACGaAgEAswMAIZsCAQCzAwAhDAQAANQEACAGAADWBAAgBwAA1wQAIO8BAQCtAwAh8wFAAK4DACH0AUAArgMAIY0CAQCzAwAhlwIBAK0DACGYAgEArQMAIZkCIADTBAAhmgIBALMDACGbAgEAswMAIQYGAAILABMNMQoRABESMAgTMgwDAwADCwAQECwBBQQGBAUKBQYMAgcOBgsADwEDAAMBAwADBQMAAwsADgwSBw0bCg8fCwMHAAYKFggLAAkCCAAHCQABAQoXAAIHAAYJAAEDBwAGCiMMCwANAgkAAQ4ACwEKJAADDCUADSYADycAAgQoAAUpAAEQLQACCwASEC4BARAvAAMNNAASMwATNQAAAgYAAhEAEQIGAAIRABEFCwAYJgAZJwAaKAAbKQAcAAAAAAAFCwAYJgAZJwAaKAAbKQAcAAADCwAhKAAiKQAjAAAAAwsAISgAIikAIwEHAAYBBwAGBQsAKCYAKScAKigAKykALAAAAAAABQsAKCYAKScAKigAKykALAIJAAEOAAsCCQABDgALBQsAMSYAMicAMygANCkANQAAAAAABQsAMSYAMicAMygANCkANQEHAAYBBwAGBQsAOiYAOycAPCgAPSkAPgAAAAAABQsAOiYAOycAPCgAPSkAPgIIAAcJAAECCAAHCQABBQsAQyYARCcARSgARikARwAAAAAABQsAQyYARCcARSgARikARwIHAAYJAAECBwAGCQABBQsATCYATScATigATykAUAAAAAAABQsATCYATScATigATykAUAAAAwsAVSgAVikAVwAAAAMLAFUoAFYpAFcBAwADAQMAAwMLAFwoAF0pAF4AAAADCwBcKABdKQBeAQMAAwEDAAMDCwBjKABkKQBlAAAAAwsAYygAZCkAZQEDAAMBAwADAwsAaigAaykAbAAAAAMLAGooAGspAGwBAwADAQMAAwMLAHEoAHIpAHMAAAADCwBxKAByKQBzAAAAAwsAeSgAeikAewAAAAMLAHkoAHopAHsUAgEVNgEWNwEXOAEYOQEaOwEbPRQcPhUdQAEeQhQfQxYiRAEjRQEkRhQqSRcrSh0sTBEtTREuUBEvUREwUhExVBEyVhQzVx40WRE1WxQ2XB83XRE4XhE5XxQ6YiA7YyQ8ZAs9ZQs-Zgs_ZwtAaAtBagtCbBRDbSVEbwtFcRRGciZHcwtIdAtJdRRKeCdLeS1MegxNewxOfAxPfQxQfgxRgAEMUoIBFFODAS5UhQEMVYcBFFaIAS9XiQEMWIoBDFmLARRajgEwW48BNlyQAQddkQEHXpIBB1-TAQdglAEHYZYBB2KYARRjmQE3ZJsBB2WdARRmngE4Z58BB2igAQdpoQEUaqQBOWulAT9spgEIbacBCG6oAQhvqQEIcKoBCHGsAQhyrgEUc68BQHSxAQh1swEUdrQBQXe1AQh4tgEIebcBFHq6AUJ7uwFIfLwBCn29AQp-vgEKf78BCoABwAEKgQHCAQqCAcQBFIMBxQFJhAHHAQqFAckBFIYBygFKhwHLAQqIAcwBCokBzQEUigHQAUuLAdEBUYwB0wEDjQHUAQOOAdcBA48B2AEDkAHZAQORAdsBA5IB3QEUkwHeAVKUAeABA5UB4gEUlgHjAVOXAeQBA5gB5QEDmQHmARSaAekBVJsB6gFYnAHsAQKdAe0BAp4B7wECnwHwAQKgAfEBAqEB8wECogH1ARSjAfYBWaQB-AECpQH6ARSmAfsBWqcB_AECqAH9AQKpAf4BFKoBgQJbqwGCAl-sAYQCBq0BhQIGrgGHAgavAYgCBrABiQIGsQGLAgayAY0CFLMBjgJgtAGQAga1AZICFLYBkwJhtwGUAga4AZUCBrkBlgIUugGZAmK7AZoCZrwBmwIEvQGcAgS-AZ0CBL8BngIEwAGfAgTBAaECBMIBowIUwwGkAmfEAaYCBMUBqAIUxgGpAmjHAaoCBMgBqwIEyQGsAhTKAa8CacsBsAJtzAGxAgXNAbICBc4BswIFzwG0AgXQAbUCBdEBtwIF0gG5AhTTAboCbtQBvAIF1QG-AhTWAb8Cb9cBwAIF2AHBAgXZAcICFNoBxQJw2wHGAnTcAcgCdd0ByQJ13gHMAnXfAc0CdeABzgJ14QHQAnXiAdICFOMB0wJ25AHVAnXlAdcCFOYB2AJ35wHZAnXoAdoCdekB2wIU6gHeAnjrAd8CfA"
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

// generated/prisma/internal/prismaNamespace.ts
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

// generated/prisma/client.ts
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
      allowDangerousEmailAccountLinking: true
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
var CategoriesServices = {
  createCategory,
  getCategories
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
var CategoriesController = {
  createCategory: createCategory2,
  getCategories: getCategories2
};

// src/modules/categories/categories.router.ts
var router2 = express2.Router();
router2.post(
  "/",
  authMiddleware_default("ADMIN" /* ADMIN */),
  CategoriesController.createCategory
);
router2.get("/", CategoriesController.getCategories);
var categoriesRouter = router2;

// src/modules/user/user.router.ts
import express3 from "express";

// src/modules/user/user.service.ts
var createCustomer = async (data, userId) => {
  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: {
        ...data,
        userId
      }
    });
    await tx.user.update({
      where: { id: userId },
      data: { role: "CUSTOMER" }
    });
    return customer;
  });
  return result;
};
var createSeller = async (data, userId) => {
  const result = await prisma.$transaction(async (tx) => {
    const seller = await tx.seller.create({
      data: {
        ...data,
        userId
      }
    });
    await tx.user.update({
      where: { id: userId },
      data: { role: "SELLER" }
    });
    return seller;
  });
  return result;
};
var getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      customer: true,
      seller: true
    },
    orderBy: { createdAt: "desc" }
  });
  return users;
};
var UserServices = {
  createCustomer,
  createSeller,
  getAllUsers
};

// src/modules/user/user.controller.ts
var createCustomerOrSeller = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;
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
    const result = await UserServices.getAllUsers();
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

// src/modules/orders/orders.service.ts
var checkout = async (userId) => {
  const customer = await prisma.customer.findUnique({
    where: { userId }
  });
  if (!customer) {
    throw new Error("User not found");
  }
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
    include: { items: true }
  });
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
  return order;
};
var updateOrderStatus = async (orderId, sellerId, status) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          medicine: true
        }
      }
    }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  const ownsMedicine = order.items.some(
    (item) => item.medicine.sellerId === sellerId
  );
  if (!ownsMedicine) {
    throw new Error("Unauthorized: Seller does not own this order's items");
  }
  const updatedOrder = await prisma.orders.update({
    where: { id: orderId },
    data: { status }
  });
  return updatedOrder;
};
var getAllOrders = async () => {
  const orders = await prisma.orders.findMany();
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
    }
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
var getOrderDetails = async (orderId, userId) => {
  const customer = await prisma.customer.findUnique({
    where: { userId }
  });
  if (!customer) {
    throw new Error("User not found");
  }
  const order = await prisma.orders.findFirst({
    where: {
      id: orderId,
      customerId: customer.id
    },
    include: {
      items: {
        include: { medicine: true }
      }
    }
  });
  if (!order) {
    throw new Error("Order not found or unauthorized");
  }
  return order;
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
    const userId = req.user?.id;
    const { orderId } = req.params;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const result = await orderService.getOrderDetails(
      orderId,
      userId
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
  authMiddleware_default("CUSTOMER" /* CUSTOMER */),
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

// src/app.ts
var app = express7();
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL
  // Production frontend URL
].filter(Boolean);
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

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("An error occured: ", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
var server_default = app_default;
export {
  server_default as default
};
