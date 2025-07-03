import { getLoungeBySlug } from "@/lib/supabase/membership";
import { notFound } from "next/navigation";
import { LoungeDetailClient } from "@/components/LoungeDetailClient";
import { Suspense } from "react";

interface LoungeDetailPageProps {
  params: Promise<{ slug: string }>;
}

function LoungeDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-48 w-full mb-4" />
      <div className="bg-gray-200 rounded h-8 w-3/4 mb-2" />
      <div className="bg-gray-200 rounded h-4 w-1/2 mb-4" />
      <div className="bg-gray-200 rounded h-10 w-full" />
    </div>
  );
}

function MembersSectionSkeleton() {
  return (
    <section className="mt-8">
      <div className="bg-gray-200 rounded h-6 w-24 mb-4" />
      <div className="space-y-2">
        <div className="bg-gray-200 rounded h-4 w-3/4" />
        <div className="bg-gray-200 rounded h-4 w-1/2" />
      </div>
    </section>
  );
}

export default async function LoungeDetailPage({
  params,
}: LoungeDetailPageProps) {
  const { slug } = await params;
  const lounge = await getLoungeBySlug(slug);

  if (!lounge) return notFound();

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <Suspense fallback={<LoungeDetailSkeleton />}>
        <LoungeDetailClient lounge={lounge[0]} />
      </Suspense>

      <Suspense fallback={<MembersSectionSkeleton />}>
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Members</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Member list coming soon...</li>
          </ul>
        </section>
      </Suspense>
    </main>
  );
}
