import express, { Router } from "express";

const router = express.Router();

router.post("/:medicineId");

export const reviewsRouter: Router = router;
