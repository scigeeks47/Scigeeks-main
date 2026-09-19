import { Router } from "express";
import { getAllUserController , createUserController, deleteUserController, updateUserController } from "../controllers/admin.controller";
import { authorize } from "../middleware/role.middleware";
import { authentication } from "../middleware/auth.middleware";

const router = Router();

router.get("/users",authentication, authorize("admin"),getAllUserController);
router.post("/users", authentication, authorize("admin"), createUserController);
router.delete("/users/:id",authentication, authorize("admin"), deleteUserController);
router.patch("/users/:id",authentication, authorize("admin"), updateUserController);

export default router;