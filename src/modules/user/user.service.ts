import { Customer, Seller } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCustomer = async (
  data: Omit<Customer, "id" | "createdAt">,
  userId: string,
) => {
  const result = await prisma.customer.create({
    data: {
      ...data,
      userId,
    },
  });
  return result;
};

const createSeller = async (
  data: Omit<Seller, "id" | "createdAt">,
  userId: string,
) => {
  const result = await prisma.seller.create({
    data: {
      ...data,
      userId,
    },
  });
  return result;
};

export const UserServices = {
  createCustomer,
  createSeller,
};
