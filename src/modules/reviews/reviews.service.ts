import { Reviews } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReviews = async (
  data: Omit<Reviews, "id" | "createdAt" | "updatedAt">,
  medicineId: string,
  userId: string,
) => {
  const customer = await prisma.customer.findUnique({
    where: { userId },
  });
  const result = await prisma.reviews.create({
    data: {
      ...data,
      medicineId,
      customerId: customer?.id as string,
    },
    include: {
      customer: {
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
      },
    },
  });
  return result;
};

const getReviews = async (medicineId: string) => {
  const result = await prisma.reviews.findMany({
    where: { medicineId },
    include: {
      customer: {
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  console.log(result);
  return result;
};

export const reviewsService = {
  createReviews,
  getReviews,
};
