-- Create table for symptom queries and recommendations
CREATE TABLE public.symptom_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  raw_query TEXT NOT NULL,
  parsed_symptoms JSONB,
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.symptom_queries ENABLE ROW LEVEL SECURITY;

-- Users can view their own queries
CREATE POLICY "Users can view their own symptom queries"
ON public.symptom_queries
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can insert their own queries
CREATE POLICY "Users can insert symptom queries"
ON public.symptom_queries
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create index for faster lookups
CREATE INDEX idx_symptom_queries_user_id ON public.symptom_queries(user_id);
CREATE INDEX idx_symptom_queries_created_at ON public.symptom_queries(created_at DESC);