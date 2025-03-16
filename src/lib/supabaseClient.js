import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl2 = process.env.NEXT_PUBLIC_SUPABASE_URL_ANOTHER;
const supabaseKey2 = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_ANOTHER;

const supabase = createClient(supabaseUrl, supabaseKey);
const supabase2 = createClient(supabaseUrl2, supabaseKey2);
// console.log(supabase, supabase2);

export { supabase, supabase2 };
