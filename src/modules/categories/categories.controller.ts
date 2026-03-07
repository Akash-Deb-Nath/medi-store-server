import { Request, Response } from "express";
import { CategoriesServices } from "./categories.service";

const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await CategoriesServices.createCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create category",
      details: error,
    });
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const result = await CategoriesServices.getCategories();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get categories",
      details: error,
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CategoriesServices.updateCategory(
      id as string,
      req.body,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to update category",
      details: error,
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CategoriesServices.deleteCategory(id as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to delete category",
      details: error,
    });
  }
};

export const CategoriesController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
