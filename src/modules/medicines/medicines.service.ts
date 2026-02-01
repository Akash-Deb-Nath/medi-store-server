import { Medicines } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const postMedicines = async (
  data: Omit<Medicines, "id" | "createdAt" | "updatedAt" | "sellerId">,
  userId: string,
) => {
  const result = await prisma.medicines.create({
    data: {
      ...data,
      sellerId: userId,
    },
  });
  return result;
};

export const MedicinesServices = {
  postMedicines,
};
