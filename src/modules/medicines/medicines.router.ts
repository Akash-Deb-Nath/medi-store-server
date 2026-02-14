import express, { Router } from "express";
import { MedicinesController } from "./medicines.controller";
import authMiddleware, { UserRole } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/", MedicinesController.getMedicines);
router.get("/:medicineId", MedicinesController.getMedicineById);
router.get(
  "/seller",
  authMiddleware(UserRole.SELLER),
  MedicinesController.getMedicineById,
);
router.post(
  "/",
  authMiddleware(UserRole.SELLER),
  MedicinesController.postMedicines,
);
router.put(
  "/:medicineId",
  authMiddleware(UserRole.SELLER),
  MedicinesController.updateMedicines,
);
router.delete(
  "/:medicineId",
  authMiddleware(UserRole.SELLER),
  MedicinesController.deleteMedicine,
);

export const medicinesRouter: Router = router;
