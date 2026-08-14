import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zoszrmovpvmbjapvsmnk.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_OO4JwomTLHhMR9YanPIxbQ_bklO2zjd';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;
