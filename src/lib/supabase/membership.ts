import { getServerSupabaseClient } from "./client";

export async function insertMembership(userId: string, loungeId: string) {
  const supabase = getServerSupabaseClient();
  const { error } = await supabase.from("memberships").insert({
    user_id: userId,
    lounge_id: loungeId,
  });
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function deleteMembership(userId: string, loungeId: string) {
  const supabase = getServerSupabaseClient();
  const { error } = await supabase
    .from("memberships")
    .delete()
    .match({ user_id: userId, lounge_id: loungeId });
  if (error) {
    return { error: error.message };
  }
  return { success: true };
} 