import LoungesDisplay from "@/components/LoungesDisplay";
import { getUserMemberships } from "@/lib/supabase/membership";
import { getUser } from "@/lib/supabase/user";

export default async function MyLoungesPage() {
  const user = await getUser();

  if (!user)
    return (
      <div className="text-center mt-10">
        Please sign in to view your lounges.
      </div>
    );

  const lounges = await getUserMemberships();

  return (
    <main className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Lounges</h1>

      {lounges && lounges.length > 0 ? (
        <LoungesDisplay lounges={lounges} />
      ) : (
        <div>You have not joined any lounges yet.</div>
      )}
    </main>
  );
}
