import express, { Router } from "express";
import { reviewsController } from "./reviews.controller";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/:medicineId",
  authMiddleware(UserRole.CUSTOMER),
  reviewsController.createReviews,
);
router.get("/:medicineId", reviewsController.getReviews);

export const reviewsRouter: Router = router;
