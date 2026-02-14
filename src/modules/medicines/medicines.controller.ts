import { Request, Response } from "express";
import { MedicinesServices } from "./medicines.service";
import { UserRole } from "../../middlewares/authMiddleware";

const postMedicines = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await MedicinesServices.postMedicines(
      req.body,
      user.id as string,
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create medicine",
      details: error,
    });
  }
};

const getMedicines = async (req: Request, res: Response) => {
  try {
    const { search, categoryId, price, manufacturer } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const categoryIdString =
      typeof categoryId === "string" ? categoryId : undefined;
    const priceNumber = typeof price === "number" ? price : null;
    const manufacturerString =
      typeof manufacturer === "string" ? manufacturer : undefined;
    const result = await MedicinesServices.getMedicines({
      categoryId: categoryIdString,
      price: priceNumber,
      manufacturer: manufacturerString,
      search: searchString,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get medicines",
      details: error,
    });
  }
};

const getMedicineById = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      throw new Error("This medicine is not available");
    }
    const result = await MedicinesServices.getMedicineById(
      medicineId as string,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Medicine retrieve failed",
      details: error,
    });
  }
};
const getMedicineBySeller = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!user || user.role !== UserRole.SELLER) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await MedicinesServices.getMedicineById(user.id as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Medicine retrieve failed",
      details: error,
    });
  }
};

const updateMedicines = async (req: Request, res: Response) => {
  try {
    const medicineId = req.params.medicineId;
    if (!medicineId) {
      return res.status(400).json({ error: "Medicine ID is required" });
    }
    const result = await MedicinesServices.updateMedicines(
      req.body,
      medicineId as string,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update medicines",
    });
  }
};

const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      throw new Error("This medicine is not available");
    }
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized");
    }
    const result = await MedicinesServices.deleteMedicine(
      medicineId as string,
      user.id,
    );
    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Medicine delete failed";
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

export const MedicinesController = {
  postMedicines,
  updateMedicines,
  getMedicines,
  getMedicineById,
  getMedicineBySeller,
  deleteMedicine,
};
