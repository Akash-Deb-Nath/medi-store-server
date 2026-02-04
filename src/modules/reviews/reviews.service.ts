import { Reviews } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReviews = async (
  data: Omit<Reviews, "id" | "createdAt" | "updatedAt">,
  medicineId: string,
  customerId: string,
) => {
  const result = await prisma.reviews.create({
    data: {
      ...data,
      medicineId,
      customerId,
    },
  });
  return result;
};
