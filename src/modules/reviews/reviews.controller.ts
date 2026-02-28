import { Request, Response } from "express";
import { reviewsService } from "./reviews.service";

const createReviews = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params;
    const data = req.body;
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("You are unauthorized");
    }
    const result = await reviewsService.createReviews(
      data,
      medicineId as string,
      userId as string,
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create reviews",
      details: error,
    });
  }
};

const getReviews = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params;
    const result = await reviewsService.getReviews(medicineId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get reviews",
      details: error,
    });
  }
};

export const reviewsController = {
  createReviews,
  getReviews,
};
