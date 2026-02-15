import express, { Router } from "express";
import { UserController } from "./user.controller";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/completeProfile",
  authMiddleware(),
  UserController.createCustomerOrSeller,
);

router.get(
  "/allUsers",
  authMiddleware(UserRole.ADMIN),
  UserController.getAllUsers,
);

export const userRouter: Router = router;
