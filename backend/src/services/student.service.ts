import { supabase } from "../config/supabase";

export const getClassByJoinCode = async (joinCode: string) => {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("join_code", joinCode.toUpperCase())
    .maybeSingle();

  return { data, error };
};

export const checkEnrollment = async (classId: string, studentId: string) => {
  const { data, error } = await supabase
    .from("class_members")
    .select("*")
    .eq("class_id", classId)
    .eq("student_id", studentId)
    .maybeSingle();

  return { data, error };
};

export const enrollStudentInClass = async (classId: string, studentId: string) => {
  const { data, error } = await supabase
    .from("class_members")
    .insert([
      {
        class_id: classId,
        student_id: studentId,
      },
    ])
    .select();

  return { data, error };
};

export const getEnrolledClassesByStudent = async (studentId: string) => {
  const { data, error } = await supabase
    .from("class_members")
    .select(`
      joined_at,
      class_id,
      student_id,
      classes:class_id (
        id,
        teacher_id,
        name,
        description,
        join_code,
        created_at
      )
    `)
    .eq("student_id", studentId);

  return { data, error };
};

export const getEnrolledClassById = async (classId: string, studentId: string) => {
  const { data, error } = await supabase
    .from("class_members")
    .select(`
      joined_at,
      class_id,
      student_id,
      classes:class_id (
        id,
        teacher_id,
        name,
        description,
        join_code,
        created_at
      )
    `)
    .eq("class_id", classId)
    .eq("student_id", studentId)
    .single();

  return { data, error };
};
