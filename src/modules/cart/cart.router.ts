import express, { Router } from "express";
import { CartController } from "./cart.controller";
import authMiddleware from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/add", authMiddleware(), CartController.addToCart);
router.get("/", CartController.getCart);
router.put("/items/:itemId", CartController.updateCartItem);
router.delete("/items/:itemId", CartController.updateCartItem);

export const cartRouter: Router = router;
