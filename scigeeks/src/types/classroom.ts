export interface ClassItem {
  id: string;
  teacher_id: string;
  name: string;
  description: string | null;
  join_code: string;
  created_at: string;
}

export interface CreateClassInput {
  name: string;
  description?: string;
}
