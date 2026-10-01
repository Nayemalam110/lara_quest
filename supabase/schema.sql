-- ==============================================================================
-- 🚀 LaraQuest Supabase Production Database Schema & Seeds (Phase 5)
-- Run this script in the Supabase SQL Editor to configure all tables, RLS policies,
-- streak tracking RPC functions, and the 16-module curriculum seed data.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
    completed_lesson_ids TEXT[] DEFAULT '{}',
    unlocked_module_ids TEXT[] DEFAULT '{"m1"}',
    earned_achievement_keys TEXT[] DEFAULT '{"first_steps"}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If profiles already exists from Phase 1, ensure columns exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='completed_lesson_ids') THEN
        ALTER TABLE public.profiles ADD COLUMN completed_lesson_ids TEXT[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='unlocked_module_ids') THEN
        ALTER TABLE public.profiles ADD COLUMN unlocked_module_ids TEXT[] DEFAULT '{"m1"}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='earned_achievement_keys') THEN
        ALTER TABLE public.profiles ADD COLUMN earned_achievement_keys TEXT[] DEFAULT '{"first_steps"}';
    END IF;
END $$;

-- 3. AUTO PROFILE TRIGGER ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        display_name,
        avatar_url,
        total_xp,
        current_level,
        completed_lesson_ids,
        unlocked_module_ids,
        earned_achievement_keys
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id || '&backgroundColor=6366f1'),
        50,
        1,
        '{}',
        '{"m1"}',
        '{"first_steps"}'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. MODULES TABLE
CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    icon_name TEXT DEFAULT 'book-open',
    color_accent TEXT DEFAULT '#38bdf8',
    order_index INTEGER NOT NULL UNIQUE,
    track TEXT NOT NULL,
    total_lessons INTEGER DEFAULT 4,
    estimated_time TEXT DEFAULT '20 mins',
    flutter_connection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_emoji TEXT DEFAULT '🏆',
    rarity TEXT DEFAULT 'common',
    condition_type TEXT NOT NULL,
    condition_value INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. USER ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- 7. USER MODULE PROGRESS
CREATE TABLE IF NOT EXISTS public.user_module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    lessons_completed INTEGER DEFAULT 0,
    is_unlocked BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, module_id)
);

-- 8. USER LESSON PROGRESS
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    status TEXT DEFAULT 'completed',
    xp_earned INTEGER DEFAULT 25,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- 9. USER TASK ATTEMPTS
CREATE TABLE IF NOT EXISTS public.user_task_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    task_type TEXT NOT NULL,
    attempt_number INTEGER DEFAULT 1,
    user_answer TEXT,
    is_correct BOOLEAN NOT NULL,
    xp_awarded INTEGER DEFAULT 0,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 🔒 ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_task_attempts ENABLE ROW LEVEL SECURITY;

-- Public read access for curriculum & leaderboard
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Modules are viewable by everyone" ON public.modules;
CREATE POLICY "Modules are viewable by everyone" ON public.modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON public.achievements;
CREATE POLICY "Achievements are viewable by everyone" ON public.achievements FOR SELECT USING (true);

-- User-authenticated modifications
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own module progress" ON public.user_module_progress;
CREATE POLICY "Users can view own module progress" ON public.user_module_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own module progress" ON public.user_module_progress;
CREATE POLICY "Users can insert own module progress" ON public.user_module_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own module progress" ON public.user_module_progress;
CREATE POLICY "Users can update own module progress" ON public.user_module_progress FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own lesson progress" ON public.user_lesson_progress;
CREATE POLICY "Users can view own lesson progress" ON public.user_lesson_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lesson progress" ON public.user_lesson_progress;
CREATE POLICY "Users can insert own lesson progress" ON public.user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own task attempts" ON public.user_task_attempts;
CREATE POLICY "Users can view own task attempts" ON public.user_task_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own task attempts" ON public.user_task_attempts;
CREATE POLICY "Users can insert own task attempts" ON public.user_task_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- ⚡ STREAK & ACTIVITY RPC ENGINE
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.record_activity(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_profile RECORD;
    v_today DATE := CURRENT_DATE;
    v_yesterday DATE := CURRENT_DATE - 1;
    v_freeze_used BOOLEAN := FALSE;
    v_streak_broken BOOLEAN := FALSE;
BEGIN
    SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Profile not found');
    END IF;

    -- Already recorded activity today
    IF v_profile.last_activity_date = v_today THEN
        RETURN jsonb_build_object(
            'streak', v_profile.current_streak,
            'longest_streak', v_profile.longest_streak,
            'action', 'already_active'
        );
    END IF;

    IF v_profile.last_activity_date = v_yesterday THEN
        -- Consecutive streak continuation
        UPDATE public.profiles SET
            current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_activity_date = v_today,
            updated_at = NOW()
        WHERE id = p_user_id;

    ELSIF v_profile.last_activity_date < v_yesterday THEN
        -- Missed a day: test for freeze
        IF v_profile.streak_freezes > 0 THEN
            UPDATE public.profiles SET
                streak_freezes = streak_freezes - 1,
                current_streak = current_streak + 1,
                longest_streak = GREATEST(longest_streak, current_streak + 1),
                last_activity_date = v_today,
                updated_at = NOW()
            WHERE id = p_user_id;
            v_freeze_used := TRUE;
        ELSE
            -- Reset streak
            UPDATE public.profiles SET
                current_streak = 1,
                last_activity_date = v_today,
                updated_at = NOW()
            WHERE id = p_user_id;
            v_streak_broken := TRUE;
        END IF;

    ELSE
        -- First recorded activity
        UPDATE public.profiles SET
            current_streak = 1,
            longest_streak = GREATEST(longest_streak, 1),
            last_activity_date = v_today,
            updated_at = NOW()
        WHERE id = p_user_id;
    END IF;

    SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;

    RETURN jsonb_build_object(
        'streak', v_profile.current_streak,
        'longest_streak', v_profile.longest_streak,
        'freeze_used', v_freeze_used,
        'streak_broken', v_streak_broken,
        'freezes_remaining', v_profile.streak_freezes
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 🌱 SEED DATA: 16 MASTER CURRICULUM MODULES
-- ==============================================================================

INSERT INTO public.modules (id, order_index, track, title, subtitle, description, icon_name, color_accent, total_lessons, estimated_time, flutter_connection)
VALUES
('m1', 1, 'Track 1: Foundations', 'Relational DB Design & Schema Architecture', 'Understanding tables, keys, and foreign constraints', 'Database design from the perspective of Dart state models.', 'database', '#38bdf8', 3, '18 mins', 'Relational tables mirror your Dart data classes and SQLite storage.'),
('m2', 2, 'Track 1: Foundations', 'Modern PHP 8 for Dart Developers', 'PHP syntax mapped to Dart equivalents', 'Strict typing, match expressions, null-safe operators, and arrow functions.', 'code-2', '#818cf8', 4, '22 mins', 'Translates Dart syntax (types, collections, classes) directly to PHP 8.2+.'),
('m3', 3, 'Track 1: Foundations', 'Server Lifecycle & Request Pipeline', 'From client socket to response envelope', 'Trace HTTP requests through Nginx, PHP-FPM, Kernel, and middleware.', 'server', '#38bdf8', 4, '25 mins', 'What happens on the server when Dio.get() sends a packet.'),
('m4', 4, 'Track 1: Foundations', 'Database Migrations & Seeders', 'Version-controlled database schema evolution', 'Writing migrations, running seeders, and factories.', 'git-merge', '#38bdf8', 4, '24 mins', 'Replaces error-prone manual SQLite onCreate scripts with declarative migrations.'),
('m5', 5, 'Track 2: Eloquent Engine', 'Eloquent ORM — Models That Query Themselves', 'ActiveRecord pattern vs DAO', 'Model definitions, query scopes, accessors, and mutators.', 'cpu', '#818cf8', 4, '24 mins', 'Like Riverpod async state providers with built-in database query builders.'),
('m6', 6, 'Track 2: Eloquent Engine', 'Relationships, Pivots & The N+1 Bug', 'One-to-Many, Many-to-Many & eager loading', 'BelongsTo, HasMany, BelongsToMany, and query optimization.', 'layers', '#818cf8', 4, '28 mins', 'Eliminate N+1 database waterfalls before they slow down your mobile API.'),
('m7', 7, 'Track 2: Eloquent Engine', 'Controllers, Routing & Route Model Binding', 'Handling HTTP actions and dependency injection', 'Controller structure, automatic model resolution, and route namespaces.', 'controller', '#818cf8', 4, '24 mins', 'Controllers are the server-side counterparts to your BLoC / ViewModel event handlers.'),
('m8', 8, 'Track 3: REST API Mastery', 'RESTful Architecture & Resource Routes', 'Standardized CRUD HTTP semantics', 'Resource controllers, URL naming conventions, and proper HTTP status codes.', 'globe', '#38bdf8', 4, '25 mins', 'Aligns API URL structures with client Dio REST service methods.'),
('m9', 9, 'Track 3: REST API Mastery', 'API Validation & 422 Envelopes', 'Form Requests and standard error handling', 'Server-side validation rules, custom FormRequests, and mobile error responses.', 'shield-alert', '#38bdf8', 4, '25 mins', 'Server validation protects data integrity and returns parseable 422 errors for Flutter forms.'),
('m10', 10, 'Track 3: REST API Mastery', 'Eloquent API Resources & JSON Transforms', 'Decoupling database schema from mobile JSON contracts', 'JsonResource, ResourceCollection, conditional attributes, and relationships.', 'package', '#38bdf8', 4, '25 mins', 'Guarantees your Flutter fromJson() models never break when database column names change.'),
('m11', 11, 'Track 3: REST API Mastery', 'Mobile API Authentication with Sanctum', 'Bearer tokens, token abilities, and revocation', 'Issue personal access tokens, guard routes, and manage multi-device sessions.', 'key', '#38bdf8', 5, '30 mins', 'The Bearer token lifecycle: stored in flutter_secure_storage, verified via Sanctum.'),
('m12', 12, 'Track 3: REST API Mastery', 'Pagination, Filtering, Sorting & Search', 'Efficient collection queries for infinite lists', 'Offset vs Cursor pagination, dynamic query filtering, and full-text search.', 'search', '#38bdf8', 4, '26 mins', 'Cursor pagination designed for Flutter ListView.builder infinite scrolling.'),
('m13', 13, 'Track 4: Advanced & DevOps', 'Multipart File & Media Uploads', 'Handling binary streams and cloud storage', 'Multipart/form-data parsing, file validation, storage disks, and signed URLs.', 'upload-cloud', '#f43f5e', 4, '26 mins', 'Handling mobile camera / gallery image uploads via Dio FormData.'),
('m14', 14, 'Track 4: Advanced & DevOps', 'Background Queues & Push Notifications', 'Asynchronous job dispatching and FCM', 'Database queues, Redis, worker listeners, and FCM push notifications.', 'bell', '#f43f5e', 4, '28 mins', 'Dispatch long-running jobs to queues so mobile HTTP responses return in <100ms.'),
('m15', 15, 'Track 4: Advanced & DevOps', 'API Rate Limiting, Redis Caching & CORS', 'Scaling throughput and securing origins', 'Throttle middleware, Redis key-value caching, and CORS configuration.', 'zap', '#f43f5e', 4, '26 mins', 'Prevent server overloads and cache frequent mobile feed responses with Redis.'),
('m16', 16, 'Track 4: Advanced & DevOps', 'Automated Testing, Swagger & Capstone', 'PEST feature testing, OpenAPI docs, and MiniGram backend', 'Feature tests, Swagger generation, and full production Capstone API deployment.', 'terminal', '#f43f5e', 4, '35 mins', 'Complete full-stack capstone backend with automated test suite and OpenAPI specification.'),
('m17', 17, 'Track 5: Real-World Architecture', 'Service Layer & Repository Pattern', 'Clean Architecture for enterprise codebases', 'Separate presentation logic from business domain and data persistence.', 'layers', '#fbbf24', 4, '25 mins', 'Extracting logic from Controllers into Services is identical to extracting logic from StatefulWidgets into BLoCs and UseCases.'),
('m18', 18, 'Track 5: Real-World Architecture', 'Events, Listeners & Observers', 'Decouple side-effects and asynchronous workflows', 'Hook into Eloquent model lifecycles, publish domain events, and explore Event Sourcing.', 'workflow', '#fbbf24', 4, '25 mins', 'Event dispatching in Laravel works just like Dart EventBus or Bloc Events, freeing the main thread from blocking side-effects.'),
('m19', 19, 'Track 5: Real-World Architecture', 'Policies & RBAC Authorization', 'Fine-grained permissions and role-based access control', 'Separate 401 unauthenticated from 403 forbidden with Policies, Spatie RBAC, and token abilities.', 'lock', '#fbbf24', 4, '25 mins', 'Never trust client-side UI hiding; server-side Policies enforce security rules regardless of how the request is dispatched.'),
('m20', 20, 'Track 5: Real-World Architecture', 'Global Error Handling & Logging', 'Production resilience, structured observability, and zero silent failures', 'Create self-rendering domain exceptions, configure Laravel 11 bootstrap exception routing, and monitor in Sentry.', 'bug', '#fbbf24', 4, '25 mins', 'Guaranteeing your Laravel API always returns JSON envelopes ensures your Flutter Dio parsers never crash on 500 HTML pages.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    track = EXCLUDED.track,
    total_lessons = EXCLUDED.total_lessons,
    estimated_time = EXCLUDED.estimated_time,
    flutter_connection = EXCLUDED.flutter_connection;

-- 10. SEED ACHIEVEMENTS
INSERT INTO public.achievements (key, name, description, icon_emoji, rarity, condition_type, condition_value)
VALUES
('first_steps', 'First Steps', 'Complete your very first Laravel lesson', '🐣', 'common', 'lessons', 1),
('on_fire', 'On Fire', 'Maintain a 7-day learning streak without missing a day', '🔥', 'rare', 'streak', 7),
('quick_learner', 'Quick Learner', 'Complete 3 lessons in a single session', '🧠', 'common', 'lessons', 3),
('perfect_score', 'Flawless Victory', 'Score 100% on any interactive challenge on first attempt', '💯', 'rare', 'special', 1),
('db_architect', 'Database Architect', 'Master database design and run your first migration', '🗄️', 'epic', 'modules', 4),
('query_ninja', 'Query Ninja', 'Diagnose and optimize N+1 queries with eager loading', '⚡', 'rare', 'special', 1),
('api_builder', 'REST Champion', 'Successfully construct your first CRUD API route collection', '🔗', 'epic', 'modules', 8),
('token_master', 'Auth Sentinel', 'Implement Sanctum bearer token authentication', '🔐', 'epic', 'modules', 11),
('full_stack_falcon', 'Full-Stack Falcon', 'Complete all 16 modules and earn your backend wings', '🦅', 'legendary', 'modules', 16)
ON CONFLICT (key) DO NOTHING;
