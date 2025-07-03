import { getServerSupabaseClient } from "./client";

export async function getUser() {
  const supabase = await getServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  return user;
}
