import { Request, Response } from "express";
import { UserRole } from "../../middlewares/authMiddleware";
import { UserServices } from "./user.service";

const createCustomerOrSeller = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const data = req.body;
    if (data.role === UserRole.CUSTOMER) {
      const result = await UserServices.createCustomer(
        data,
        user?.id as string,
      );
      return result;
    } else if (data.role === UserRole.SELLER) {
      const result = await UserServices.createSeller(data, user?.id as string);
      return result;
    }
  } catch (error) {
    res.status(400).json({
      error: "Failed to create customer or seller",
      details: error,
    });
  }
};

export const UserController = {
  createCustomerOrSeller,
};
