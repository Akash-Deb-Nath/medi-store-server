import express, { Router } from "express";

const router = express.Router();

router.post("/:medicineId");

export const ordersRouter: Router = router;
