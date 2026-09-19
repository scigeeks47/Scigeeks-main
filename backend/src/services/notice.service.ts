import { supabase } from "../config/supabase";
import { CreateNoticeDTO } from "../types/notice.types";

export const createNotice = async (
  noticeData: CreateNoticeDTO,
  classId: string,
  teacherId: string
) => {
  const { data, error } = await supabase
    .from("notices")
    .insert([
      {
        class_id: classId,
        teacher_id: teacherId,
        title: noticeData.title.trim(),
        message: noticeData.message.trim(),
      },
    ])
    .select();

  return { data, error };
};

export const getNoticesByClassAndTeacher = async (
  classId: string,
  teacherId: string
) => {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("class_id", classId)
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const getNoticesForStudent = async (studentId: string) => {
  const { data, error } = await supabase
    .from("notice_recipients")
    .select(`
      id,
      notice_id,
      student_id,
      is_read,
      delivered_at,
      read_at,
      notices:notice_id (
        id,
        class_id,
        teacher_id,
        title,
        message,
        created_at,
        updated_at
      )
    `)
    .eq("student_id", studentId)
    .order("delivered_at", { ascending: false });

  return { data, error };
};

export const markNoticeAsRead = async (noticeId: string, studentId: string) => {
  const { data, error } = await supabase
    .from("notice_recipients")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("notice_id", noticeId)
    .eq("student_id", studentId)
    .select();

  return { data, error };
};
