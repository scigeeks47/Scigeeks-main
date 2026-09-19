-- Migration: Create Classroom System
-- Description: Create public.classes and public.class_members tables with constraints and indexes.

-- 1. Create public.classes table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    join_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE RESTRICT
);

-- 2. Create public.class_members table
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL,
    student_id UUID NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_class_members_class FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_class_members_student FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT unique_class_student_membership UNIQUE (class_id, student_id)
);

-- 3. Create performance indexes for foreign key lookups
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.classes (teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_members_class_id ON public.class_members (class_id);
CREATE INDEX IF NOT EXISTS idx_class_members_student_id ON public.class_members (student_id);
