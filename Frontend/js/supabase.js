const SUPABASE_URL='YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY='YOUR_SUPABASE_ANON_KEY';
export const isSupabaseConfigured=!SUPABASE_URL.startsWith('YOUR_');
export let supabase=null;
if(isSupabaseConfigured){import('https://esm.sh/@supabase/supabase-js@2').then(({createClient})=>{supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY)});}
