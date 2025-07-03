import { getServerSupabaseClient } from "./client";
import { getUser } from "./user";

export async function getLoungesWithMembershipAndCounts() {
  const supabase = await getServerSupabaseClient();
  
  const { data } = await supabase.rpc('get_lounges_with_user_membership');
  console.log("data", data);
  return { lounges: data };
}

export async function getUserMemberships() {
  const supabase = await getServerSupabaseClient();
  const { data } = await supabase.rpc('get_my_lounges');

  console.log("data", data);
  return data;
}

export async function getLoungeBySlug(slug: string) {
  const supabase = await getServerSupabaseClient();
  const { data } = await supabase.rpc("get_lounge_by_slug", {
    slug: slug,
  });
  return data;
}