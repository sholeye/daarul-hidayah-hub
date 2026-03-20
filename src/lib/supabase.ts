import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ntkhalornetabwcuvskz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_qntHrRH2eR1QhlwiMvbCVw_cz3wPSvW';

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
