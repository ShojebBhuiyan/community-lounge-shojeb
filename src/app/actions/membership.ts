"use server";
import { getServerSupabaseClient } from "@/lib/supabase/client";
import { insertMembership, deleteMembership } from "@/lib/supabase/membership";

export async function joinLounge(loungeId: string) {
  const supabase = getServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Not authenticated" };
  }
  return insertMembership(user.id, loungeId);
}

export async function leaveLounge(loungeId: string) {
  const supabase = getServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Not authenticated" };
  }
  return deleteMembership(user.id, loungeId);
} 