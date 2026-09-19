import { Router } from "express";
import {
  authTest,
  checkEmailController,
  createAccountController,
  createTeacherAccountController,
} from "../controllers/auth.controller";

const router = Router();

router.get("/test", authTest);
router.post("/check-email", checkEmailController);
router.post("/create-account", createAccountController);
router.post("/create-teacher-account", createTeacherAccountController);

export default router;