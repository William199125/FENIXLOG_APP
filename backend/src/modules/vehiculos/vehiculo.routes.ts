import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import * as controller from "./vehiculo.controller";

const router = Router();

router.get("/", authMiddleware, asyncHandler(controller.listar));
router.post("/", authMiddleware, requireRole("ADMIN"), asyncHandler(controller.crear));
router.put("/:id", authMiddleware, requireRole("ADMIN"), asyncHandler(controller.actualizar));
router.delete("/:id", authMiddleware, requireRole("ADMIN"), asyncHandler(controller.eliminar));

export default router;