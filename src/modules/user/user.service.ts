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

    console.log(customer);

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
    const user = await prisma.user.findUnique({ where: { id: userId } });
    console.log(user);

    await tx.user.update({
      where: { id: userId },
      data: { role: "SELLER" },
    });

    return seller;
  });

  return result;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      customer: true,
      seller: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return users;
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      customer: true,
      seller: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const updateUserStatus = async (userId: string, status: string) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
  return updatedUser;
};

export const UserServices = {
  createCustomer,
  createSeller,
  getAllUsers,
};
