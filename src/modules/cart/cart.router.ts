import express, { Router } from "express";
import { CartController } from "./cart.controller";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/add",
  authMiddleware(UserRole.CUSTOMER),
  CartController.addToCart,
);
router.get("/", authMiddleware(UserRole.CUSTOMER), CartController.getCart);
router.put(
  "/items/:itemId",
  authMiddleware(UserRole.CUSTOMER),
  CartController.updateCartItem,
);
router.delete(
  "/items/:itemId",
  authMiddleware(UserRole.CUSTOMER),
  CartController.deleteCartItem,
);

export const cartRouter: Router = router;
