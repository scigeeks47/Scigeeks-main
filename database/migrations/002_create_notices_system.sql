-- Migration: Create Notices System
-- Description: Create public.notices and public.notice_recipients tables with constraints,
--              indexes and triggers. Notices posted by a teacher to a class are automatically
--              forwarded to every enrolled student at the database level.

-- 1. Create public.notices table
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_notices_class FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_notices_teacher FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE RESTRICT
);

-- 2. Create public.notice_recipients table
CREATE TABLE IF NOT EXISTS public.notice_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_id UUID NOT NULL,
    student_id UUID NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    delivered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ,
    CONSTRAINT fk_notice_recipients_notice FOREIGN KEY (notice_id) REFERENCES public.notices(id) ON DELETE CASCADE,
    CONSTRAINT fk_notice_recipients_student FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT unique_notice_student_recipient UNIQUE (notice_id, student_id)
);

-- 3. Create performance indexes for foreign key lookups
CREATE INDEX IF NOT EXISTS idx_notices_class_id ON public.notices (class_id);
CREATE INDEX IF NOT EXISTS idx_notices_teacher_id ON public.notices (teacher_id);
CREATE INDEX IF NOT EXISTS idx_notice_recipients_notice_id ON public.notice_recipients (notice_id);
CREATE INDEX IF NOT EXISTS idx_notice_recipients_student_id ON public.notice_recipients (student_id);

-- 4. Forwarding trigger: fan a new notice out to every student enrolled in the class
CREATE OR REPLACE FUNCTION public.forward_notice_to_class_members()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.notice_recipients (notice_id, student_id)
    SELECT NEW.id, cm.student_id
    FROM public.class_members cm
    WHERE cm.class_id = NEW.class_id
    ON CONFLICT (notice_id, student_id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notices_forward_to_class_members ON public.notices;
CREATE TRIGGER trg_notices_forward_to_class_members
AFTER INSERT ON public.notices
FOR EACH ROW
EXECUTE FUNCTION public.forward_notice_to_class_members();

-- 5. Keep updated_at current on every notice update
CREATE OR REPLACE FUNCTION public.set_notices_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notices_set_updated_at ON public.notices;
CREATE TRIGGER trg_notices_set_updated_at
BEFORE UPDATE ON public.notices
FOR EACH ROW
EXECUTE FUNCTION public.set_notices_updated_at();
