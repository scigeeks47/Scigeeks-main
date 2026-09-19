import { Router } from "express";
import axios from "axios";

const router = Router();
const AI_BASE_URL = process.env.PYTHON_AI_URL || "http://localhost:8000";  

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const response = await axios.post(`${AI_BASE_URL}/ask`, {
      question,
    });

    return res.json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    return res.status(503).json({
      success: false,
      message: "SciGenAI service unavailable",
      error: error.response?.data || error.message,
    });
  }
});

export default router;