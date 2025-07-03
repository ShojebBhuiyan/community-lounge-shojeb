"use client";

import React from "react";
import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";

export type LoungeCardVariant = "default" | "dialog" | "condensed";

export type LoungeCardProps = {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  memberCount: number;
  isMember: boolean;
  onToggleMembership: (loungeId: string) => void;
  variant?: LoungeCardVariant;
  condensed?: boolean;
  className?: string;
  disabled?: boolean;
  slug: string;
};

function LoungeCard({
  id,
  imageUrl,
  title,
  description,
  memberCount,
  isMember,
  onToggleMembership,
  variant = "default",
  condensed = false,
  className = "",
  disabled = false,
  slug,
}: LoungeCardProps) {
  const router = useRouter();

  function handleCardClick() {
    router.push(`/lounges/${slug}`);
  }

  function handleButtonClick(event: React.MouseEvent) {
    event.stopPropagation(); // Prevent card click when button is clicked
    if (disabled) return;
    onToggleMembership(id);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  }

  // Variant/condensed styles
  const isCondensed = condensed || variant === "condensed";
  const isDialog = variant === "dialog";

  const cardPadding = isCondensed ? "p-2" : isDialog ? "p-6" : "p-4";
  const imageSize = isCondensed ? 64 : isDialog ? 200 : 128;
  const imageClass = isCondensed
    ? "h-16 w-16"
    : isDialog
    ? "h-48 w-full"
    : "h-32 w-full";
  const titleSize = isCondensed
    ? "text-base"
    : isDialog
    ? "text-2xl"
    : "text-xl";
  const descriptionSize = isDialog ? "text-base" : "text-sm";

  return (
    <Card
      className={`flex flex-col items-center justify-between gap-2 ${cardPadding} ${className} cursor-pointer hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      tabIndex={0}
      aria-label={`Lounge card for ${title}. Click to view details.`}
      role="button"
      onKeyDown={handleKeyDown}
      onClick={handleCardClick}
    >
      <div className={`relative ${imageClass} w-full`}>
        {isCondensed ? (
          <Image
            src={imageUrl}
            alt={`${title} lounge image`}
            width={imageSize}
            height={imageSize}
            className="rounded-md object-cover"
            sizes="64px"
            priority={variant === "default"}
          />
        ) : (
          <Image
            src={imageUrl}
            alt={`${title} lounge image`}
            fill
            className="rounded-md object-cover"
            sizes={
              isDialog
                ? "(max-width: 768px) 100vw, 600px"
                : "(max-width: 768px) 100vw, 400px"
            }
            priority={variant === "default"}
          />
        )}
      </div>

      <div className="flex flex-col w-full mt-2">
        <div className="flex items-center justify-between w-full">
          <span className={`font-semibold ${titleSize}`}>{title}</span>
          <Badge className="ml-2" aria-label={`${memberCount} members`}>
            {memberCount}
          </Badge>
        </div>

        {description && (
          <p className={`text-gray-600 mt-2 ${descriptionSize} line-clamp-2`}>
            {description}
          </p>
        )}
      </div>

      <Button
        onClick={handleButtonClick}
        aria-label={isMember ? `Leave ${title}` : `Join ${title}`}
        variant={isMember ? "secondary" : "default"}
        className="w-full mt-2"
        disabled={disabled}
      >
        {disabled ? "Loading..." : isMember ? "Leave" : "Join"}
      </Button>
    </Card>
  );
}

export { LoungeCard };
