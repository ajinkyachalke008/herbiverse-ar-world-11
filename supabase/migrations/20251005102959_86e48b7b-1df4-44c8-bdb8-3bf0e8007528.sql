-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  favorite_herb TEXT,
  location TEXT,
  joined_date TIMESTAMPTZ DEFAULT NOW(),
  total_scans INTEGER DEFAULT 0,
  total_discoveries INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create plant scans table
CREATE TABLE public.plant_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plant_image_url TEXT NOT NULL,
  common_name TEXT,
  scientific_name TEXT,
  family TEXT,
  confidence TEXT,
  identification TEXT,
  medicinal_uses JSONB,
  active_compounds JSONB,
  preparation JSONB,
  dosage TEXT,
  safety_warnings JSONB,
  habitat TEXT,
  cultural_significance TEXT,
  conservation_status TEXT,
  scan_location TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create community discoveries table
CREATE TABLE public.community_discoveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scan_id UUID REFERENCES public.plant_scans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  image_url TEXT NOT NULL,
  plant_name TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create discovery likes table
CREATE TABLE public.discovery_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  discovery_id UUID REFERENCES public.community_discoveries(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, discovery_id)
);

-- Create discovery comments table
CREATE TABLE public.discovery_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  discovery_id UUID REFERENCES public.community_discoveries(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user favorites table
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  herb_id TEXT NOT NULL,
  herb_name TEXT,
  herb_scientific_name TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, herb_id)
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-images', 'plant-images', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('community-images', 'community-images', true);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- RLS Policies for plant_scans
CREATE POLICY "Users can view their own scans"
ON public.plant_scans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public scans"
ON public.plant_scans FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can insert their own scans"
ON public.plant_scans FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scans"
ON public.plant_scans FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans"
ON public.plant_scans FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for community_discoveries
CREATE POLICY "Everyone can view community discoveries"
ON public.community_discoveries FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own discoveries"
ON public.community_discoveries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discoveries"
ON public.community_discoveries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discoveries"
ON public.community_discoveries FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for discovery_likes
CREATE POLICY "Everyone can view likes"
ON public.discovery_likes FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own likes"
ON public.discovery_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
ON public.discovery_likes FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for discovery_comments
CREATE POLICY "Everyone can view comments"
ON public.discovery_comments FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own comments"
ON public.discovery_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.discovery_comments FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for user_favorites
CREATE POLICY "Users can view their own favorites"
ON public.user_favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
ON public.user_favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON public.user_favorites FOR DELETE
USING (auth.uid() = user_id);

-- Storage RLS Policies
CREATE POLICY "Anyone can view plant images"
ON storage.objects FOR SELECT
USING (bucket_id = 'plant-images');

CREATE POLICY "Users can upload their own plant images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'plant-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own plant images"
ON storage.objects FOR DELETE
USING (bucket_id = 'plant-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view community images"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-images');

CREATE POLICY "Users can upload community images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'community-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own community images"
ON storage.objects FOR DELETE
USING (bucket_id = 'community-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user scan count
CREATE OR REPLACE FUNCTION public.update_user_scan_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.profiles
  SET total_scans = total_scans + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Trigger to update scan count
CREATE TRIGGER on_plant_scan_created
  AFTER INSERT ON public.plant_scans
  FOR EACH ROW EXECUTE FUNCTION public.update_user_scan_count();

-- Function to update likes count
CREATE OR REPLACE FUNCTION public.update_discovery_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_discoveries
    SET likes_count = likes_count + 1
    WHERE id = NEW.discovery_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_discoveries
    SET likes_count = likes_count - 1
    WHERE id = OLD.discovery_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger to update likes count
CREATE TRIGGER on_discovery_like_changed
  AFTER INSERT OR DELETE ON public.discovery_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_discovery_likes_count();

-- Function to update comments count
CREATE OR REPLACE FUNCTION public.update_discovery_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_discoveries
    SET comments_count = comments_count + 1
    WHERE id = NEW.discovery_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_discoveries
    SET comments_count = comments_count - 1
    WHERE id = OLD.discovery_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger to update comments count
CREATE TRIGGER on_discovery_comment_changed
  AFTER INSERT OR DELETE ON public.discovery_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_discovery_comments_count();

-- Function to update discovery count
CREATE OR REPLACE FUNCTION public.update_user_discovery_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.profiles
  SET total_discoveries = total_discoveries + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Trigger to update discovery count
CREATE TRIGGER on_discovery_created
  AFTER INSERT ON public.community_discoveries
  FOR EACH ROW EXECUTE FUNCTION public.update_user_discovery_count();

-- Function to update profile updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for community features
ALTER PUBLICATION supabase_realtime ADD TABLE public.discovery_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discovery_comments;