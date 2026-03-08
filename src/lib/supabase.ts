import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://isrvwleoafpptcomsjfz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_fjX4sME5EncLWW7Ogcjh6w_sKiUIs7N';

export const createIsolatedAuthClient = () => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    storage: undefined,
  },
});

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = (): boolean => true;
