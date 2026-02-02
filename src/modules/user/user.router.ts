import express, { Router } from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.post("/completeProfile", UserController.createCustomerOrSeller);


export const userRouter: Router = router;
