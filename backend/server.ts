import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import healthRoutes from "./src/routes/health.routes";
import authRoutes from "./src/routes/auth.routes";
import {authentication} from "./src/middleware/auth.middleware";
import { authorize } from "./src/middleware/role.middleware";
import adminRoutes from "./src/routes/admin.routes";
import teacherRoutes from "./src/routes/teacher.routes";
import aiRoutes from "./src/routes/ai.routes";

import studentRoutes from "./src/routes/student.routes";

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello Scigeeks Backend");
});

const PORT = process.env.PORT || 5000;

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/teacher",teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/ai", aiRoutes);
app.get("/api/profile",authentication, (req: Request, res: Response) => res.json({
  success:true,
  message:"Profile fetched successfully",
  user: (req as any).user
}));
app.get("/api/admin",authentication, authorize("admin"), (req: Request, res: Response) => res.json({
  success:true,
  message:"Admin dashboard",
}));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});