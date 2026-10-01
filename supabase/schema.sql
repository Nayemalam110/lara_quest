-- ==============================================================================
-- 🚀 LaraQuest Supabase Database Schema (Phase 1)
-- Run this in your Supabase SQL Editor to set up the backend database.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'flutter_dev',
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    streak_freezes INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. MODULES TABLE
CREATE TABLE IF NOT EXISTS public.modules (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    icon_emoji TEXT DEFAULT '📘',
    color_accent TEXT DEFAULT '#6366f1',
    order_index INTEGER NOT NULL UNIQUE,
    total_lessons INTEGER DEFAULT 4,
    estimated_time TEXT DEFAULT '20 mins',
    flutter_connection TEXT,
    unlock_after_module_id INTEGER REFERENCES public.modules(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_emoji TEXT DEFAULT '🏆',
    rarity TEXT DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    condition_type TEXT NOT NULL,  -- 'streak', 'xp', 'lessons', 'modules', 'special'
    condition_value INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- 6. USER MODULE PROGRESS
CREATE TABLE IF NOT EXISTS public.user_module_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_id INTEGER REFERENCES public.modules(id) ON DELETE CASCADE,
    lessons_completed INTEGER DEFAULT 0,
    is_unlocked BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, module_id)
);

-- ==============================================================================
-- 🔒 ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view (for leaderboard), user can update their own
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Modules & Achievements: Public read
CREATE POLICY "Modules are viewable by everyone"
    ON public.modules FOR SELECT USING (true);

CREATE POLICY "Achievements are viewable by everyone"
    ON public.achievements FOR SELECT USING (true);

-- User Achievements: Users see only their own
CREATE POLICY "Users can view own achievements"
    ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
    ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Module Progress: Users manage their own progress
CREATE POLICY "Users can view own module progress"
    ON public.user_module_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own module progress"
    ON public.user_module_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own module progress"
    ON public.user_module_progress FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================================================
-- 🌱 SEED DATA
-- ==============================================================================

INSERT INTO public.modules (order_index, title, subtitle, description, icon_emoji, color_accent, total_lessons, estimated_time, flutter_connection)
VALUES
(0, 'The Big Picture', 'Connecting Flutter to the Server', 'What happens after Dio.get() sends a packet into the internet? Unravel the server request-response lifecycle and understand MVC from a Flutter state perspective.', '🗺️', '#3b82f6', 4, '15 mins', 'Think of the server as the unseen mirror of your Dio/Http client and Riverpod state.'),
(1, 'PHP Crash Course for Dart Devs', 'Dart syntax meets modern PHP 8+', 'You already know types, classes, async, and methods in Dart. Learn PHP without starting from zero by comparing side-by-side.', '🐘', '#8b5cf6', 4, '20 mins', 'Dart `List<Map>` becomes PHP arrays; Dart classes become PHP classes with type hinting.'),
(2, 'Laravel Setup & Artisan', 'Like `flutter create` for APIs', 'Initialize projects, navigate the directory anatomy, and master the Artisan CLI companion that replaces your repetitive boilerplate.', '🏗️', '#ef4444', 4, '20 mins', '`php artisan make:controller` is like your Flutter code generator (`build_runner`), but instant.'),
(3, 'Routing & Endpoints', 'Where URLs Meet Executable Code', 'Define RESTful HTTP verbs (GET, POST, PUT, DELETE) and map URL query params and path params directly to actions.', '🛣️', '#f59e0b', 5, '25 mins', 'The route definitions in Laravel match the URL strings you put inside `Dio.request("/api/v1/...")`.'),
(4, 'Controllers & Responses', 'The Brain of Your API', 'Handle incoming payloads, manipulate data, and serialize crisp JSON responses that your Flutter `fromJson()` can consume without errors.', '🎮', '#10b981', 5, '25 mins', 'Controllers are like your Bloc/Notifier event handlers, triggered by incoming HTTP events.'),
(5, 'Database & Migrations', 'The Scary Part Made Intuitive', 'Visual relational tables, foreign keys, and version-controlled schemas. Never be intimidated by SQL again.', '🗄️', '#ec4899', 6, '35 mins', 'No more wondering where the JSON data lives — design tables just like you design Flutter state models.'),
(6, 'Eloquent ORM', 'Database Queries Made Beautiful', 'Say goodbye to raw SQL strings. Query relational models with fluent, chainable methods that read like English.', '✨', '#06b6d4', 6, '30 mins', '`User::with("orders")->find(1)` gives you the exact nested object your UI expects.'),
(7, 'Requests & Validation', 'The Bulletproof Gatekeeper', 'Validate payloads before they touch your database. Automatically generate helpful HTTP 422 JSON errors that Flutter forms can display.', '📬', '#84cc16', 5, '25 mins', 'Your Flutter form validation protects the user; server validation protects your system.'),
(8, 'Authentication & Sanctum', 'Tokens, Bearers & Middleware', 'Understand how Bearer tokens are issued, encrypted, verified, and protected across secure routes.', '🔐', '#6366f1', 5, '30 mins', 'The Bearer token you save in `flutter_secure_storage` is born and validated here.'),
(9, 'Building RESTful APIs', 'The Grand Full-Stack Connection', 'API Resources, pagination headers, file uploads with multipart forms, and rate limiting.', '🌐', '#14b8a6', 6, '35 mins', 'Build the complete backend for a realistic mobile app from scratch.'),
(10, 'Testing Your API', 'Confidence Before Deployment', 'Write feature tests with Laravel PEST/PHPUnit to verify that your endpoints always return the expected JSON schema.', '🧪', '#a855f7', 4, '20 mins', 'Like Flutter unit and integration tests, but testing HTTP status codes and JSON payloads.'),
(11, 'Final Capstone Project', 'From Dart to PHP Champion', 'Design, build, and document a production-ready API for a real Flutter application.', '🚀', '#f43f5e', 7, '45 mins', 'Your capstone badge proves you are no longer just a client dev — you are a full-stack engineer.')
ON CONFLICT (order_index) DO NOTHING;

-- Seed Achievements
INSERT INTO public.achievements (key, name, description, icon_emoji, rarity, condition_type, condition_value)
VALUES
('first_steps', 'First Steps', 'Complete your very first Laravel lesson', '🐣', 'common', 'lessons', 1),
('on_fire', 'On Fire', 'Maintain a 7-day learning streak without missing a day', '🔥', 'rare', 'streak', 7),
('quick_learner', 'Quick Learner', 'Complete 3 lessons in a single session', '🧠', 'common', 'lessons', 3),
('perfect_score', 'Flawless Victory', 'Score 100% on any interactive challenge on first attempt', '💯', 'rare', 'special', 1),
('db_architect', 'Database Architect', 'Master database design and run your first migration', '🗄️', 'epic', 'modules', 5),
('api_builder', 'REST Champion', 'Successfully construct your first CRUD API route collection', '🔗', 'epic', 'modules', 9),
('night_owl', 'Night Owl', 'Level up after midnight', '🌙', 'common', 'special', 1),
('speed_demon', 'Speed Demon', 'Solve an interactive task in under 45 seconds', '⚡', 'rare', 'special', 1),
('full_stack_falcon', 'Full-Stack Falcon', 'Complete all 12 modules and earn your backend wings', '🦅', 'legendary', 'modules', 12)
ON CONFLICT (key) DO NOTHING;
