// ==============================================================================
// 🔌 Supabase Client & Connection Manager
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '%c[LaraQuest] Running in Local Demo Mode with LocalStorage persistence. To connect to Supabase, provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
    'color: #3b82f6; font-weight: bold;'
  );
}
