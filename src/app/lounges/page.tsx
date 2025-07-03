import { getLoungesWithMembershipAndCounts } from "@/lib/supabase/membership";
import { LoungesGridClient } from "@/components/LoungesGridClient";
import { Suspense } from "react";

export const revalidate = 600; // ISR: 10 minutes

// function LoungesGridSkeleton() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//       {Array.from({ length: 6 }).map((_, i) => (
//         <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
//       ))}
//     </div>
//   );
// }

export default async function LoungesPage() {
  // Fetch lounges with membership status
  const { lounges } = await getLoungesWithMembershipAndCounts();
  console.log("lounges", lounges);

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">
          Welcome to Community Lounges
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Discover, join, and connect with like-minded people in curated
          lounges.
        </p>
        <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
          {lounges?.length || 0} Lounges Available
        </span>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Explore Lounges
        </h2>
        {/* <Suspense fallback={<LoungesGridSkeleton />}> */}
        <LoungesGridClient lounges={lounges || []} />
        {/* </Suspense> */}
      </section>
    </main>
  );
}
