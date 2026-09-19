import { Request, Response } from "express";
import {
  getAuthTestMessage,
  checkEmailAvailable,
  createAccount,
} from "../services/auth.service";
import { supabase } from "../config/supabase";

export const authTest = (
  req: Request,
  res: Response
): void => {
  const result = getAuthTestMessage();

  res.status(200).json(result);
};

export const checkEmailController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      success: false,
      message: "Email is required",
    });
    return;
  }

  const result =
    await checkEmailAvailable(email);

  res.status(200).json(result);
};

const handleAccountCreation = async (
  req: Request,
  res: Response,
  assignedRole: string
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Missing token",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token format",
    });
    return;
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      res.status(403).json({
        success: false,
        message: "Forbidden: Invalid token",
      });
      return;
    }

    const verifiedId = user.id;
    const verifiedEmail = user.email || (user.phone ? `${user.phone}@phone.scigeeks.internal` : "");

    if (!verifiedEmail) {
      res.status(400).json({
        success: false,
        message: "Bad Request: User must have an email or phone number associated",
      });
      return;
    }

    const { name } = req.body;
    if (!name) {
      res.status(400).json({
        success: false,
        message: "Name is required",
      });
      return;
    }

    const result =
      await createAccount({
        name,
        email: verifiedEmail,
        id: verifiedId,
        role: assignedRole,
      });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const createAccountController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await handleAccountCreation(req, res, "student");
};

export const createTeacherAccountController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await handleAccountCreation(req, res, "teacher");
};