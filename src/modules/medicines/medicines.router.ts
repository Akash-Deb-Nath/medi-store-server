import express, { Router } from "express";
import { MedicinesController } from "./medicines.controller";

const router = express.Router();

router.post("/", MedicinesController.postMedicines);

export const medicinesRouter: Router = router;
