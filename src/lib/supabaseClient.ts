import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://iburcvkoswmzgsojeyuf.supabase.co';
const supabaseKey = 'sb_publishable_O9r10DoWv5GZqUk-aSBGsg_xgbjmIsC'; 

export const supabase = createClient(supabaseUrl, supabaseKey);