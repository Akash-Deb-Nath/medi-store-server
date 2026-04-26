import { Customer, Seller } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCustomer = async (
  data: Omit<Customer, "id" | "createdAt">,
  userId: string,
) => {
  // const result = await prisma.$transaction(async (tx) => {
  const result = await prisma.customer.create({
    data: {
      ...data,
      userId,
    },
  });

  //   // await tx.user.update({
  //   //   where: { id: userId },
  //   //   data: { role: "CUSTOMER" },
  //   // });

  //   return customer;
  // });

  return result;
};

const createSeller = async (
  data: Omit<Seller, "id" | "createdAt">,
  userId: string,
) => {
  const seller = await prisma.seller.create({
    data: {
      ...data,
      userId,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { role: "SELLER" },
  });

  return seller;
};

const getAllUsers = async ({
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const users = await prisma.user.findMany({
    take: limit,
    skip,
    include: {
      customer: true,
      seller: true,
    },
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  const total = await prisma.user.count();
  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
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
