import { Medicines } from "../../../generated/prisma/client";
import { MedicinesWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const postMedicines = async (
  data: Omit<Medicines, "id" | "createdAt" | "updatedAt" | "sellerId">,
  userId: string,
) => {
  const seller = await prisma.seller.findUnique({
    where: { userId },
  });
  if (!seller) {
    throw new Error("Seller not found");
  }

  const result = await prisma.medicines.create({
    data: {
      ...data,
      sellerId: seller?.id as string,
    },
  });
  return result;
};

const getMedicines = async ({
  categoryId,
  price,
  manufacturer,
  search,
}: {
  categoryId: string | undefined;
  price: number | null;
  manufacturer: string | undefined;
  search: string | undefined;
}) => {
  const andConditions: MedicinesWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  if (categoryId) {
    andConditions.push({
      categoryId,
    });
  }
  if (price) {
    andConditions.push({
      price,
    });
  }
  if (manufacturer) {
    andConditions.push({
      manufacturer: {
        contains: manufacturer,
        mode: "insensitive",
      },
    });
  }
  const result = await prisma.medicines.findMany({
    where: {
      AND: andConditions,
    },
  });

  return result;
};

const getMedicineById = async (medicineId: string) => {
  const result = await prisma.medicines.findUnique({
    where: {
      id: medicineId,
    },
  });
  return result;
};

const getMedicineBySeller = async (userId: string) => {
  const seller = await prisma.seller.findUnique({
    where: { userId },
  });
  if (!seller) {
    throw new Error("Seller not found");
  }
  const result = await prisma.medicines.findMany({
    where: {
      sellerId: seller.id as string,
    },
  });
  return result;
};

const updateMedicines = async (
  data: Omit<Medicines, "id" | "createdAt" | "updatedAt" | "sellerId">,
  medicineId: string,
) => {
  const result = await prisma.medicines.updateMany({
    where: {
      id: medicineId,
    },
    data,
  });
  return result;
};

const deleteMedicine = async (medicineId: string, sellerId: string) => {
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
    select: {
      id: true,
      sellerId: true,
    },
  });
  if (medicineData.sellerId !== sellerId) {
    throw new Error("You are not the owner");
  }
  return await prisma.medicines.delete({
    where: {
      id: medicineId,
    },
  });
};

export const MedicinesServices = {
  postMedicines,
  updateMedicines,
  getMedicines,
  getMedicineById,
  getMedicineBySeller,
  deleteMedicine,
};
