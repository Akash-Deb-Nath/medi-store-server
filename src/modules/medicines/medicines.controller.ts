import { Request, Response } from "express";
import { MedicinesServices } from "./medicines.service";

const postMedicines = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await MedicinesServices.postMedicines(
      req.body,
      user.id as string,
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create medicine",
      details: error,
    });
  }
};

export const MedicinesController = {
  postMedicines,
};
