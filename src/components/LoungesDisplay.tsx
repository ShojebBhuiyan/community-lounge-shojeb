"use client";
import { LoungeCard } from "./LoungeCard";
import { useLoungeMembership } from "@/hooks/useLoungeMembership";

export type LoungeWithMembership = {
  id: string;
  image_url: string;
  title: string;
  slug: string;
  description: string;
  is_member: boolean;
  member_count: number;
};

type LoungeCardWrapperProps = {
  lounge: LoungeWithMembership;
};

function LoungeCardWrapper({ lounge }: LoungeCardWrapperProps) {
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
      disabled={isLoading}
      slug={lounge.slug}
    />
  );
}

type LoungesDisplayProps = {
  lounges: LoungeWithMembership[];
};

export default function LoungesDisplay({ lounges }: LoungesDisplayProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {lounges.map((lounge) => (
        <LoungeCardWrapper key={lounge.id} lounge={lounge} />
      ))}
    </div>
  );
}
