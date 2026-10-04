import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as controller from "./orden.controller";

const router = Router();

router.get("/", authMiddleware, asyncHandler(controller.listar));
router.post("/", authMiddleware, asyncHandler(controller.crear));
router.put("/:id", authMiddleware, asyncHandler(controller.actualizar));
router.delete("/:id", authMiddleware, asyncHandler(controller.eliminar));

export default router;