"use server";
import { getServerSupabaseClient } from "@/lib/supabase/client";

export async function joinLounge(loungeId: string) {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Not authenticated" };
  }
  
  const { error } = await supabase.from("memberships").insert({
    user_id: user.id,
    lounge_id: loungeId,
  });
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function leaveLounge(loungeId: string) {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Not authenticated" };
  }
  
  const { error } = await supabase
    .from("memberships")
    .delete()
    .match({ user_id: user.id, lounge_id: loungeId });
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}



 