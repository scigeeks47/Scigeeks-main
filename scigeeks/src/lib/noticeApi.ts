import { NoticeItem, CreateNoticeInput, StudentNoticeItem } from "../types/notice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TEACHER_BASE_URL = `${API_BASE}/api/teacher`;
const STUDENT_BASE_URL = `${API_BASE}/api/student`;

export async function createNotice(
  token: string,
  classId: string,
  input: CreateNoticeInput
): Promise<{ success: boolean; notice?: NoticeItem; message?: string }> {
  try {
    const res = await fetch(`${TEACHER_BASE_URL}/classes/${classId}/notices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });
    return await res.json();
  } catch (err: unknown) {
    console.error("API createNotice error:", err);
    return { success: false, message: "Network connection failed" };
  }
}

export async function listClassNotices(
  token: string,
  classId: string
): Promise<{ success: boolean; notices?: NoticeItem[]; message?: string }> {
  try {
    const res = await fetch(`${TEACHER_BASE_URL}/classes/${classId}/notices`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err: unknown) {
    console.error("API listClassNotices error:", err);
    return { success: false, message: "Network connection failed" };
  }
}

export async function listStudentNotices(
  token: string
): Promise<{ success: boolean; notices?: StudentNoticeItem[]; message?: string }> {
  try {
    const res = await fetch(`${STUDENT_BASE_URL}/notices`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err: unknown) {
    console.error("API listStudentNotices error:", err);
    return { success: false, message: "Network connection failed" };
  }
}

export async function markNoticeRead(
  token: string,
  noticeId: string
): Promise<{
  success: boolean;
  recipient?: Pick<StudentNoticeItem, "id" | "is_read" | "delivered_at" | "read_at"> & {
    notice_id: string;
    student_id: string;
  };
  message?: string;
}> {
  try {
    const res = await fetch(`${STUDENT_BASE_URL}/notices/${noticeId}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err: unknown) {
    console.error("API markNoticeRead error:", err);
    return { success: false, message: "Network connection failed" };
  }
}
