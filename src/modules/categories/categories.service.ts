import { Categories } from "../../../prisma/generated/prisma/client";
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

const updateCategory = async (
  id: string,
  data: Omit<Categories, "id" | "createdAt" | "updatedAt" | "name">,
) => {
  console.log(id, data);
  const result = await prisma.categories.update({
    where: { id },
    data,
  });
  return result;
};

const deleteCategory = async (id: string) => {
  console.log(id);
  const result = await prisma.categories.delete({
    where: { id },
  });
  console.log(result);
  return result;
};

export const CategoriesServices = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
