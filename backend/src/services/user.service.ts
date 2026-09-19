import { supabase } from "../config/supabase";

export const createUser = async (
  userData: {
    name: string;
    email: string;
    role: string;
    id: string;
  }
) => {
  const { data, error } =
    await supabase
      .from("users")
      .insert([userData])
      .select();

  return {
    data,
    error,
  };
};

export const getUserByEmail =
  async (
    email: string
  ) => {
    const {
      data,
      error,
    } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    return {
      data,
      error,
    };
  };

export const getUserById =
  async (
    id: string
  ) => {
    const {
      data,
      error,
    } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    return {
      data,
      error,
    };
  };

export const getAllUsers =
  async () => {
    const {
      data,
      error,
    } = await supabase
      .from("users")
      .select(
        "id, name, email, role, created_at"
      );

    return {
      data,
      error,
    };
  };

export const deleteUser =
  async (
    id: string
  ) => {
    const {
      data,
      error,
    } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select();

    return {
      data,
      error,
    };
  };

export const updateUserById =
  async (
    id: string,
    update: {
      name?: string;
      email?: string;
      role?: string;
    }
  ) => {
    const {
      data,
      error,
    } = await supabase
      .from("users")
      .update(update)
      .eq("id", id)
      .select();

    return {
      data,
      error,
    };
  };