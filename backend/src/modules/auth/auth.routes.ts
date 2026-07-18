import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as authController from "./auth.controller";

const router = Router();

router.post("/registrar", asyncHandler(authController.registrar));
router.post("/login", asyncHandler(authController.login));
router.post("/refrescar", asyncHandler(authController.refrescar));

export default router;