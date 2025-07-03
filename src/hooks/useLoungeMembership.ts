import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { joinLounge, leaveLounge } from "@/app/actions/membership";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type UseLoungeMembershipProps = {
  initialIsMember: boolean;
  initialMemberCount: number;
};

export function useLoungeMembership({ 
  initialIsMember, 
  initialMemberCount 
}: UseLoungeMembershipProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isMember, setIsMember] = useState(initialIsMember);
  const [memberCount, setMemberCount] = useState(initialMemberCount);
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggleMembership(loungeId: string) {
    if (!user) {
      router.push("/signin");
      return;
    }

    setIsLoading(true);

    if (isMember) {
      // Optimistic update for leaving
      setIsMember(false);
      setMemberCount(prev => Math.max(prev - 1, 0));

      const result = await leaveLounge(loungeId);

      if (result.error) {
        // Revert optimistic update on error
        setIsMember(true);
        setMemberCount(prev => prev + 1);
        toast.error(`Failed to leave lounge: ${result.error}`);
      } else {
        toast.success("Successfully left the lounge");
      }
    } else {
      // Optimistic update for joining
      setIsMember(true);
      setMemberCount(prev => prev + 1);

      const result = await joinLounge(loungeId);

      if (result.error) {
        // Revert optimistic update on error
        setIsMember(false);
        setMemberCount(prev => Math.max(prev - 1, 0));
        toast.error(`Failed to join lounge: ${result.error}`);
      } else {
        toast.success("Successfully joined the lounge");
      }
    }

    setIsLoading(false);
  }

  return {
    isMember,
    memberCount,
    isLoading,
    handleToggleMembership
  };
} 