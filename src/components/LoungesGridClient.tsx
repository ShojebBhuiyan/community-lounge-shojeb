"use client";

import { LoungeCard } from "./LoungeCard";
import { useLoungeMembership } from "@/hooks/useLoungeMembership";

type Lounge = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  slug: string;
  is_member: boolean;
  member_count: number;
};

type LoungesGridClientProps = {
  lounges: Lounge[];
};

function LoungeCardClient({ lounge }: { lounge: Lounge }) {
  const { isMember, memberCount, isLoading, handleToggleMembership } =
    useLoungeMembership({
      initialIsMember: lounge.is_member,
      initialMemberCount: lounge.member_count,
    });

  return (
    <LoungeCard
      key={lounge.id}
      id={lounge.id}
      imageUrl={lounge.image_url}
      title={lounge.title}
      description={lounge.description}
      memberCount={memberCount}
      isMember={isMember}
      onToggleMembership={handleToggleMembership}
      slug={lounge.slug}
      disabled={isLoading}
    />
  );
}

export function LoungesGridClient({ lounges }: LoungesGridClientProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {lounges.map((lounge) => (
        <LoungeCardClient key={lounge.id} lounge={lounge} />
      ))}
    </div>
  );
}
