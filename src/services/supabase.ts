import { createClient } from "@supabase/supabase-js";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYXJud2xzZ2hndXFnYmNscXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4Mzg4MzcsImV4cCI6MjAzODQxNDgzN30.DmXzYFwdnMNyTM4g6Cp_4n9RID9Lv00Cidqu8FSDSR0";
export const SUPABASE_URL = "https://kiarnwlsghguqgbclqxb.supabase.co";
const supabase = createClient(SUPABASE_URL, supabaseKey);
export default supabase;
