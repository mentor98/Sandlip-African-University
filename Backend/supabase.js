import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL)
  || (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL)
  || 'https://zoszrmovpvmbjapvsmnk.supabase.co';

const SUPABASE_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY)
  || (typeof process !== 'undefined' && process.env && process.env.SUPABASE_PUBLISHABLE_KEY)
  || 'sb_publishable_OO4JwomTLHhMR9YanPIxbQ_bklO2zjd';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;
