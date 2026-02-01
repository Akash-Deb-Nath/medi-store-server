import { Categories } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (
  data: Omit<Categories, "id" | "createdAt" | "updatedAt">,
) => {
  const result = await prisma.categories.create({
    data,
  });
  return result;
};

const getCategories = async () => {
  const result = await prisma.categories.findMany();
  return result;
};

export const CategoriesServices = {
  createCategory,
  getCategories,
};
