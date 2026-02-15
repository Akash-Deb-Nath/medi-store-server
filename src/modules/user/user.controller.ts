import { Request, Response } from "express";
import { UserRole } from "../../middlewares/authMiddleware";
import { UserServices } from "./user.service";

const createCustomerOrSeller = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const data = req.body;
    console.log(user);
    console.log(data);

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Validate role
    if (data.role !== UserRole.CUSTOMER && data.role !== UserRole.SELLER) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role. Must be CUSTOMER or SELLER",
      });
    }

    let result;

    if (data.role === UserRole.SELLER) {
      result = await UserServices.createSeller(data, user.id);
    } else {
      result = await UserServices.createCustomer(data, user.id);
    }

    return res.status(201).json({
      success: true,
      message: `${data.role} profile created successfully`,
      data: result,
      redirectTo:
        data.role === UserRole.SELLER
          ? "/seller/dashboard"
          : "/customer/dashboard",
    });
  } catch (error: any) {
    console.error("Create profile error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create customer or seller",
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Users retrieve failed",
      details: error,
    });
  }
};

export const UserController = {
  createCustomerOrSeller,
  getAllUsers,
};
