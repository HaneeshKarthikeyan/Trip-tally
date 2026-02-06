import { createClient } from '@supabase/supabase-js';

// REPLACE THESE WITH YOUR ACTUAL SUPABASE KEYS
// Go to Supabase Dashboard -> Settings (Gear Icon) -> API
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-public-key';

export const supabase = createClient(supabaseUrl, supabaseKey);