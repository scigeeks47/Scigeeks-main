import { Router, Request, Response } from "express";
import { authentication } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  joinClassController,
  getEnrolledClassesController,
  getEnrolledClassByIdController,
} from "../controllers/student.controller";
import {
  getStudentNoticesController,
  markNoticeReadController,
} from "../controllers/notice.controller";

const router = Router();

// Base student route
router.get("/", authentication, authorize("student"), (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Student dashboard",
  });
});

router.post("/classes/join", authentication, authorize("student"), joinClassController);
router.get("/classes", authentication, authorize("student"), getEnrolledClassesController);
router.get("/classes/:id", authentication, authorize("student"), getEnrolledClassByIdController);

router.get("/notices", authentication, authorize("student"), getStudentNoticesController);
router.patch("/notices/:id/read", authentication, authorize("student"), markNoticeReadController);

export default router;
