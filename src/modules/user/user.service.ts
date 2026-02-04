import { Customer, Seller } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCustomer = async (
  data: Omit<Customer, "id" | "createdAt">,
  userId: string,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: {
        ...data,
        userId,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { role: "CUSTOMER" },
    });

    return customer;
  });

  return result;
};

const createSeller = async (
  data: Omit<Seller, "id" | "createdAt">,
  userId: string,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const seller = await tx.seller.create({
      data: {
        ...data,
        userId,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { role: "SELLER" },
    });

    return seller;
  });

  return result;
};

export const UserServices = {
  createCustomer,
  createSeller,
};
