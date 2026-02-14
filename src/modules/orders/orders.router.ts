import express, { Router } from "express";
import { ordersController } from "./orders.controller";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/checkout",
  authMiddleware(UserRole.CUSTOMER),
  ordersController.checkout,
);
router.get(
  "/",
  authMiddleware(UserRole.SELLER, UserRole.CUSTOMER),
  ordersController.getOrders,
);
router.get(
  "/:orderId",
  authMiddleware(UserRole.CUSTOMER),
  ordersController.getOrderDetails,
);
router.put(
  "/:orderId",
  authMiddleware(UserRole.SELLER),
  ordersController.updateOrderStatus,
);

export const ordersRouter: Router = router;
