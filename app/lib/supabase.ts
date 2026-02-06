import { createClient } from '@supabase/supabase-js';

// Your Project URL
const supabaseUrl = "https://nniyqwezwcvhctytvose.supabase.co";

// Your Publishable Key
const supabaseKey = "sb_publishable_NInY90yzfCJew_Y1wHYWhQ_at8wpYSo";

export const supabase = createClient(supabaseUrl, supabaseKey);