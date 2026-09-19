import {
  getAllUsers,
  createUser,
  deleteUser,
  getUserByEmail,
  updateUserById,
  getUserById,
} from "./user.service";
import { supabase } from "../config/supabase";
import crypto from "crypto";

export const getUsers = async () => {
  const result = await getAllUsers();

  return {
    success: true,
    users: result.data,
  };
};

export const createUserByAdmin = async (
  name: string,
  email: string,
  role: string
) => {
  const existingUser =
    await getUserByEmail(email);

  if (existingUser.data) {
    return {
      success: false,
      message: "User already exists",
    };
  }

  if (role === "admin") {
    return {
      success: false,
      message:
        "Admin cannot be created by admin",
    };
  }

  if (
    role !== "student" &&
    role !== "teacher"
  ) {
    return {
      success: false,
      message: "Invalid role",
    };
  }

  // 1. Generate a secure temporary password
  const tempPassword = crypto.randomBytes(16).toString("hex") + "A1!";

  // 2. Create the Auth account using Supabase Auth Admin API
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });

  if (authError || !authData.user) {
    return {
      success: false,
      message: authError?.message || "Failed to create authentication account",
    };
  }

  const authUser = authData.user;

  // 3. Insert into public.users
  const result = await createUser({
    id: authUser.id,
    name,
    email,
    role,
  });

  // 4. If inserting into public.users fails, delete the created Auth user to prevent orphaned accounts
  if (result.error || !result.data) {
    await supabase.auth.admin.deleteUser(authUser.id);

    return {
      success: false,
      message: result.error?.message || "Failed to create user record in database",
    };
  }

  // 5. Generate a password-reset link so the user can set their own password
  let setPasswordLink: string | null = null;
  try {
    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${process.env.FRONTEND_URL}/auth/reset-password`,
      },
    });
    setPasswordLink = linkData?.properties?.action_link ?? null;
  } catch (linkErr) {
    console.error("Failed to generate set-password link:", linkErr);
    // Non-fatal — user was still created, admin can manually send a reset
  }

  return {
    success: true,
    message: "User created successfully. Share the setPasswordLink with the user so they can set their password.",
    user: result.data,
    setPasswordLink,
  };
};

export const removeUser = async (
  id: string
) => {
  const existingUser =
    await getUserById(id);

  if (!existingUser.data) {
    return {
      success: false,
      message: "User not found",
    };
  }

  if (
    existingUser.data.role === "admin"
  ) {
    return {
      success: false,
      message:
        "Cannot delete admin",
    };
  }

  // Delete from Supabase Auth first (prevents orphaned auth accounts)
  const { error: authDeleteError } = await supabase.auth.admin.deleteUser(id);
  if (authDeleteError) {
    console.error("Failed to delete auth user:", authDeleteError.message);
    // Non-fatal for the DB deletion — continue to remove from public.users
  }

  const result =
    await deleteUser(id);

  return {
    success: true,
    message:
      "User deleted successfully",
    user: result.data,
  };
};

export const updateUser = async (
  id: string,
  updates: {
    name?: string;
    email?: string;
    role?: string;
  }
) => {
  if (updates.role === "admin") {
    return {
      success: false,
      message:
        "Cannot assign admin role",
    };
  }

  const result =
    await updateUserById(
      id,
      updates
    );

  return {
    success: true,
    message:
      "User updated successfully",
    user: result.data,
  };
};