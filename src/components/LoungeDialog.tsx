"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { LoungeCard } from "./LoungeCard";
import { useLoungeMembership } from "@/hooks/useLoungeMembership";

type LoungeDialogProps = {
  lounge: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    slug: string;
    is_member: boolean;
    member_count: number;
  };
  isOpen: boolean;
  onClose: () => void;
};

export function LoungeDialog({ lounge, isOpen, onClose }: LoungeDialogProps) {
  const { isMember, memberCount, isLoading, handleToggleMembership } =
    useLoungeMembership({
      initialIsMember: lounge.is_member,
      initialMemberCount: lounge.member_count,
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lounge Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
