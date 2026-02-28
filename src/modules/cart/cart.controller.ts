import { Request, Response } from "express";
import { CartService } from "./cart.service";

const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const data = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await CartService.addToCart(data, userId as string);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to add to cart",
      details: error,
    });
  }
};

const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await CartService.getCart(userId as string);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get cart items",
      details: error,
    });
  }
};

const updateCartItem = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (!itemId) {
      return res
        .status(401)
        .json({ error: "This medicine is not in the cart" });
    }
    const result = await CartService.updateCartItem(itemId as string, quantity);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to update cart items",
      details: error,
    });
  }
};

const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    if (!itemId) {
      return res
        .status(401)
        .json({ error: "This medicine is not in the cart" });
    }
    const result = await CartService.deleteCartItem(itemId as string);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to delete cart items",
      details: error,
    });
  }
};

export const CartController = {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
};
