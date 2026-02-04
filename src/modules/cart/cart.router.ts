import express, { Router } from "express";
import { CartController } from "./cart.controller";

const router = express.Router();

router.post("/addToCart", CartController.addToCart);
router.get("/cart", CartController.getCart);
router.put("/cart/items/:itemId", CartController.updateCartItem);
router.delete("/cart/items/:itemId", CartController.updateCartItem);

export const cartRouter: Router = router;
