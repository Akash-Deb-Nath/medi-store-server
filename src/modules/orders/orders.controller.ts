import { Request, Response } from "express";
import { orderService } from "./orders.service";
import { UserRole } from "../../middlewares/authMiddleware";

const checkout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log(userId);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const result = await orderService.checkout(userId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Checkout failed",
      details: (error as Error).message,
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const sellerId = req.user?.id;

    if (!sellerId) {
      throw new Error("Unauthorized");
    }

    const result = await orderService.updateOrderStatus(
      orderId as string,
      sellerId,
      status,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to update order status",
      details: (error as Error).message,
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await orderService.getAllOrders();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get orders",
      details: error,
    });
  }
};

const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      throw new Error("Unauthorized");
    }
    let result;
    if (role === UserRole.SELLER) {
      result = await orderService.getSellerOrders(userId);
    } else if (role === UserRole.CUSTOMER) {
      result = await orderService.getCustomerOrders(userId);
    } else {
      throw new Error("Not allowed");
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch orders",
      details: (error as Error).message,
    });
  }
};

const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const result = await orderService.getOrderDetails(
      orderId as string,
      userId,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch order details",
      details: (error as Error).message,
    });
  }
};

export const ordersController = {
  checkout,
  updateOrderStatus,
  getAllOrders,
  getOrders,
  getOrderDetails,
};
