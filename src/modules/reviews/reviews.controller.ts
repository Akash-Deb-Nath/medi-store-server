import { Request, Response } from "express";

const createReviews = async (req: Request, res: Response) => {
    const sellerId=req.user?.id;
  const { medicineId } = req.params;
  const data=req.body;

  const result=await
};
