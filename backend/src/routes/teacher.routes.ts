import { Router, Request , Response } from "express";
import {authentication} from "../middleware/auth.middleware";
import {authorize} from "../middleware/role.middleware";
import {
  createClassController,
  getClassesController,
  getClassByIdController,
  deleteClassController,
} from "../controllers/class.controller";
import {
  createNoticeController,
  getNoticesForClassController,
} from "../controllers/notice.controller";

const router = Router();
router.get("/profile", authentication , authorize("teacher"), (req:Request, res:Response) => {
    res.json({
        success:true,
        message:"Teacher profile fetched successfully",
    })
  
})

router.post("/classes", authentication, authorize("teacher"), createClassController);
router.get("/classes", authentication, authorize("teacher"), getClassesController);
router.get("/classes/:id", authentication, authorize("teacher"), getClassByIdController);
router.delete("/classes/:id", authentication, authorize("teacher"), deleteClassController);

router.post("/classes/:id/notices", authentication, authorize("teacher"), createNoticeController);
router.get("/classes/:id/notices", authentication, authorize("teacher"), getNoticesForClassController);

export default router;