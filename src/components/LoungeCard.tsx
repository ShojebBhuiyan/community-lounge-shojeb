import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export type LoungeCardVariant = "default" | "dialog" | "condensed";

export type LoungeCardProps = {
  imageUrl: string;
  title: string;
  memberCount: number;
  isMember: boolean;
  onJoin: () => void;
  onLeave: () => void;
  variant?: LoungeCardVariant;
  condensed?: boolean;
  className?: string;
};

function LoungeCard({
  imageUrl,
  title,
  memberCount,
  isMember,
  onJoin,
  onLeave,
  variant = "default",
  condensed = false,
  className = "",
}: LoungeCardProps) {
  function handleButtonClick() {
    if (isMember) {
      onLeave();
      return;
    }
    onJoin();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      handleButtonClick();
    }
  }

  // Variant/condensed styles
  const isCondensed = condensed || variant === "condensed";
  const cardPadding = isCondensed ? "p-2" : "p-4";
  const imageSize = isCondensed ? "h-16 w-16" : "h-32 w-full";
  const titleSize = isCondensed ? "text-base" : "text-xl";

  return (
    <Card
      className={`flex flex-col items-center gap-2 ${cardPadding} ${className}`}
      tabIndex={0}
      aria-label={`Lounge card for ${title}`}
      role="group"
      onKeyDown={handleKeyDown}
    >
      <img
        src={imageUrl}
        alt={title}
        className={`rounded-md object-cover ${imageSize}`}
        aria-label={`${title} lounge image`}
        loading="lazy"
      />
      <div className="flex items-center justify-between w-full mt-2">
        <span className={`font-semibold ${titleSize}`}>{title}</span>
        <Badge className="ml-2" aria-label={`${memberCount} members`}>
          {memberCount}
        </Badge>
      </div>
      <Button
        onClick={handleButtonClick}
        aria-label={isMember ? `Leave ${title}` : `Join ${title}`}
        variant={isMember ? "secondary" : "default"}
        className="w-full mt-2"
      >
        {isMember ? "Leave" : "Join"}
      </Button>
    </Card>
  );
}

export { LoungeCard };
