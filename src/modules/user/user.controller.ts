import { Request, Response } from "express";
import { UserRole } from "../../middlewares/authMiddleware";
import { UserServices } from "./user.service";

const createCustomerOrSeller = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const data = req.body;

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

    if (data.role === UserRole.CUSTOMER) {
      result = await UserServices.createCustomer(data, user.id);
    } else {
      result = await UserServices.createSeller(data, user.id);
    }

    // Success response - Frontend hard reload korbe
    return res.status(201).json({
      success: true,
      message: `${data.role} profile created successfully`,
      data: result,
      // Optional: Suggest redirect path
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

export const UserController = {
  createCustomerOrSeller,
};
