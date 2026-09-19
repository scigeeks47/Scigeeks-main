export interface CreateClassDTO {
  name: string;
  description?: string;
}

export interface ClassSchema {
  id: string;
  teacher_id: string;
  name: string;
  description: string | null;
  join_code: string;
  created_at: string;
}
