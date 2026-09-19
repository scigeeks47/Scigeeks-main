export interface JoinClassDTO {
  joinCode: string;
}

export interface EnrolledClassSchema {
  joined_at: string;
  class_id: string;
  student_id: string;
  classes: {
    id: string;
    teacher_id: string;
    name: string;
    description: string | null;
    join_code: string;
    created_at: string;
  };
}
