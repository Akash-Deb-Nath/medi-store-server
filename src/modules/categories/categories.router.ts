import express, { Router } from "express";
import { CategoriesController } from "./categories.controller";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware(UserRole.ADMIN),
  CategoriesController.createCategory,
);
router.get("/", CategoriesController.getCategories);

export const categoriesRouter: Router = router;
