export interface CreateNoticeDTO {
  title: string;
  message: string;
}

export interface NoticeSchema {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface NoticeRecipientSchema {
  id: string;
  notice_id: string;
  student_id: string;
  is_read: boolean;
  delivered_at: string;
  read_at: string | null;
}
