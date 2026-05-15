import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://ntjvfrntkqmkmjbwokwx.supabase.co';
const supabaseKey = 'sb_publishable_8N3lHZdNiR5ajdDl5YLaUQ_6C9jM26g'; 

export const supabase = createClient(supabaseUrl, supabaseKey);