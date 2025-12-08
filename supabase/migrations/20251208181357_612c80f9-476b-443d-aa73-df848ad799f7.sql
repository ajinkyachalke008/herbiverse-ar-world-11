-- Create enum for sex
CREATE TYPE public.biological_sex AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- Create enum for activity level
CREATE TYPE public.activity_level AS ENUM ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active');

-- Create enum for allergy type
CREATE TYPE public.allergy_type AS ENUM ('food', 'environmental', 'medication', 'other');

-- Create enum for allergy severity
CREATE TYPE public.allergy_severity AS ENUM ('mild', 'moderate', 'severe', 'life_threatening');

-- Create user_health_profiles table for core health data
CREATE TABLE public.user_health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  date_of_birth DATE,
  biological_sex public.biological_sex,
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  activity_level public.activity_level DEFAULT 'moderately_active',
  dietary_preference TEXT[],
  smoking_status TEXT,
  alcohol_consumption TEXT,
  sleep_hours_avg NUMERIC(3,1),
  health_goals TEXT[],
  family_history TEXT[],
  is_pregnant BOOLEAN DEFAULT false,
  is_breastfeeding BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_chronic_conditions table
CREATE TABLE public.user_chronic_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  condition_name TEXT NOT NULL,
  diagnosis_date DATE,
  severity TEXT,
  is_managed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_allergies table
CREATE TABLE public.user_allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  allergy_name TEXT NOT NULL,
  allergy_type public.allergy_type NOT NULL,
  severity public.allergy_severity DEFAULT 'moderate',
  reaction_description TEXT,
  diagnosed_by_doctor BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_medications table
CREATE TABLE public.user_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  medication_type TEXT DEFAULT 'prescription',
  prescribing_physician TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  purpose TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chronic_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_medications ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_health_profiles
CREATE POLICY "Users can view their own health profile"
ON public.user_health_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health profile"
ON public.user_health_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health profile"
ON public.user_health_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health profile"
ON public.user_health_profiles FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for user_chronic_conditions
CREATE POLICY "Users can view their own conditions"
ON public.user_chronic_conditions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conditions"
ON public.user_chronic_conditions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conditions"
ON public.user_chronic_conditions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conditions"
ON public.user_chronic_conditions FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for user_allergies
CREATE POLICY "Users can view their own allergies"
ON public.user_allergies FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own allergies"
ON public.user_allergies FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own allergies"
ON public.user_allergies FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own allergies"
ON public.user_allergies FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for user_medications
CREATE POLICY "Users can view their own medications"
ON public.user_medications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medications"
ON public.user_medications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications"
ON public.user_medications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications"
ON public.user_medications FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_health_profile_updated_at
BEFORE UPDATE ON public.user_health_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();