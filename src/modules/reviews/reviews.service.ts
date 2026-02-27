import { Reviews } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReviews = async (
  data: Omit<Reviews, "id" | "createdAt" | "updatedAt">,
  medicineId: string,
  userId: string,
) => {
  const customer = await prisma.customer.findUnique({
    where: { userId },
  });
  console.log({ data, userId, medicineId, customer });
  const result = await prisma.reviews.create({
    data: {
      ...data,
      medicineId,
      customerId: customer?.id as string,
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
  return result;
};

export const reviewsService = {
  createReviews,
  getReviews,
};
