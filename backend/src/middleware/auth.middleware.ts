import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { getUserByEmail } from "../services/user.service";

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader =
    req.header("Authorization");

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const token =
    authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "No token provided",
    });
    return;
  }

  try {
    // 1. Verify the Supabase JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(403).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }

    const email = user.email || (user.phone ? `${user.phone}@phone.scigeeks.internal` : null);
    if (!email) {
      res.status(403).json({
        success: false,
        message: "Invalid token: user has no email or phone",
      });
      return;
    }

    // 2. Fetch the corresponding database user to get their role
    const { data: dbUser, error: dbError } = await getUserByEmail(email);

    if (dbError || !dbUser) {
      res.status(403).json({
        success: false,
        message: "User profile not found",
      });
      return;
    }

    // 3. Attach the database profile to the request object
    (req as any).user = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
    };

    next();
  } catch {
    res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};