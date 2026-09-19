-- Migration 000: Create Users Table
-- Run this in Supabase SQL Editor FIRST before migrations 001 and 002
-- Description: Creates the public.users table that the backend reads/writes for all auth flows.

-- 1. Create public.users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,           -- Matches auth.users.id (Supabase Auth UID)
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Unique constraint on email (one profile per email)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- 3. Performance index on role (for role-based lookups)
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);

-- 4. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 5. Service role (backend) can do everything — bypasses RLS
CREATE POLICY "Service role full access"
  ON public.users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 6. Authenticated users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
