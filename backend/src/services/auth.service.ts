import { signupDTO } from "../types/auth.types";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../services/user.service";
import { supabase } from "../config/supabase";

export const getAuthTestMessage = () => {
  return {
    success: true,
    message: "Authentication module is working",
  };
};





export const checkEmailAvailable = async (
  email: string
) => {
  const existingUser = await getUserByEmail(email);

  if (existingUser.data) {
    return {
      success: false,
      state: "REGISTERED",
      emailVerified: true,
      nextStep: "login",
      message: "A user with this email address has already been registered",
    };
  }

  // Check if user exists in Supabase Auth but not in our public database
  try {
    const { data: authData } = await supabase.auth.admin.listUsers();
    if (authData && authData.users) {
      const targetUser = authData.users.find(u => u.email === email);
      if (targetUser) {
        const emailVerified = !!targetUser.email_confirmed_at;
        return {
          success: true,
          state: "SIGNUP_INCOMPLETE",
          emailVerified,
          nextStep: emailVerified ? "complete_profile" : "verify_email",
          message: "Registration is incomplete. Let's resume.",
        };
      }
    }
  } catch (err) {
    console.error("Error looking up Auth user:", err);
  }

  return {
    success: true,
    state: "NEW_USER",
    emailVerified: false,
    nextStep: "verify_email",
    message: "Email is available",
  };
};

export const createAccount =
  async (
    userData: signupDTO
  ) => {
    // Check by ID first (most reliable primary key lookup)
    const existingUserById = await getUserById(userData.id);
    if (existingUserById.data) {
      return {
        success: true,
        message: "User already exists",
        user: existingUserById.data,
      };
    }

    // Check by Email next
    const existingUser =
      await getUserByEmail(
        userData.email
      );

    if (
      existingUser.data
    ) {
      return {
        success: true,
        message:
          "User already exists",
        user: existingUser.data,
      };
    }

    const savedUser =
      await createUser({
        name:
          userData.name,
        email:
          userData.email,
        role:
          userData.role || "student",
          id:
          userData.id
      });

    if (savedUser.error) {
      // Handle unique constraint conflict race conditions gracefully
      if (savedUser.error.code === "23505") {
        const existing = await getUserById(userData.id);
        if (existing.data) {
          return {
            success: true,
            message: "User already exists",
            user: existing.data,
          };
        }
      }
      throw savedUser.error;
    }

    const user =
      savedUser.data?.[0];

    return {
      success: true,
      message:
        "Account created successfully",
      user,
    };
};