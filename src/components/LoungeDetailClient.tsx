"use client";

import { LoungeCard } from "./LoungeCard";
import { useLoungeMembership } from "@/hooks/useLoungeMembership";

type LoungeDetailClientProps = {
  lounge: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    slug: string;
    is_member: boolean;
    member_count: number;
  };
};

export function LoungeDetailClient({ lounge }: LoungeDetailClientProps) {
  const { isMember, memberCount, isLoading, handleToggleMembership } =
    useLoungeMembership({
      initialIsMember: lounge.is_member,
      initialMemberCount: lounge.member_count,
    });

  return (
    <LoungeCard
      id={lounge.id}
      imageUrl={lounge.image_url}
      title={lounge.title}
      description={lounge.description}
      memberCount={memberCount}
      isMember={isMember}
      onToggleMembership={handleToggleMembership}
      variant="dialog"
      disabled={isLoading}
      slug={lounge.slug}
    />
  );
}
