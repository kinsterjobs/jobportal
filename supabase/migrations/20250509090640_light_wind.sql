/*
  # JobHub Database Schema

  1. New Tables
    - `users` - Stores user information
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `jobs` - Stores job listings
      - `id` (uuid, primary key)
      - `title` (text)
      - `company` (text)
      - `location` (text)
      - `type` (text)
      - `salary` (text)
      - `description` (text)
      - `requirements` (text)
      - `created_by` (uuid, references users.id)
      - `posted_at` (timestamp)
    
    - `applications` - Stores job applications
      - `id` (uuid, primary key)
      - `job_id` (uuid, references jobs.id)
      - `user_id` (uuid, references users.id)
      - `user_name` (text)
      - `user_email` (text)
      - `phone` (text)
      - `cover_letter` (text)
      - `resume` (text)
      - `status` (text)
      - `applied_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'jobseeker',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  salary text NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  created_by uuid NOT NULL REFERENCES public.users(id),
  posted_at timestamptz DEFAULT now()
);

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id),
  user_id uuid NOT NULL REFERENCES public.users(id),
  user_name text NOT NULL,
  user_email text NOT NULL,
  phone text NOT NULL,
  cover_letter text NOT NULL,
  resume text NOT NULL,
  status text DEFAULT 'pending',
  applied_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data" 
  ON public.users 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
  ON public.users 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Anyone can view jobs" 
  ON public.jobs 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Employers can create jobs" 
  ON public.jobs 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'employer'
    )
  );

CREATE POLICY "Employers can update their own jobs" 
  ON public.jobs 
  FOR UPDATE 
  TO authenticated 
  USING (created_by = auth.uid());

-- Applications policies
CREATE POLICY "Users can view their own applications" 
  ON public.applications 
  FOR SELECT 
  TO authenticated 
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = applications.job_id 
      AND jobs.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create applications" 
  ON public.applications 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own applications" 
  ON public.applications 
  FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid());