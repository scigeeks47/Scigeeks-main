import crypto from "crypto";
import { supabase } from "../config/supabase";
import { CreateClassDTO, ClassSchema } from "../types/class.types";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Generates an 8-character uppercase alphanumeric code.
 * Excludes easily confusable characters (O, 0, I, 1).
 */
export function generateJoinCode(length = 8): string {
  const bytes = crypto.randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    const val = bytes[i];
    if (val !== undefined) {
      code += ALPHABET[val % ALPHABET.length];
    }
  }
  return code;
}

/**
 * Generates a unique join code by checking for existing collisions.
 */
async function generateUniqueJoinCode(): Promise<string> {
  let isUnique = false;
  let code = "";
  let attempts = 0;

  while (!isUnique && attempts < 5) {
    code = generateJoinCode();
    const { data, error } = await supabase
      .from("classes")
      .select("id")
      .eq("join_code", code)
      .maybeSingle();

    if (!error && !data) {
      isUnique = true;
    }
    attempts++;
  }

  return code;
}

export const createClass = async (
  classData: CreateClassDTO,
  teacherId: string
) => {
  const joinCode = await generateUniqueJoinCode();

  const { data, error } = await supabase
    .from("classes")
    .insert([
      {
        name: classData.name.trim(),
        description: classData.description ? classData.description.trim() : null,
        teacher_id: teacherId,
        join_code: joinCode,
      },
    ])
    .select();

  return { data, error };
};

export const getClassesByTeacher = async (teacherId: string) => {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const getClassByIdAndTeacher = async (classId: string, teacherId: string) => {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("id", classId)
    .eq("teacher_id", teacherId)
    .single();

  return { data, error };
};

export const deleteClassByIdAndTeacher = async (classId: string, teacherId: string) => {
  const { data, error } = await supabase
    .from("classes")
    .delete()
    .eq("id", classId)
    .eq("teacher_id", teacherId)
    .select();

  return { data, error };
};
