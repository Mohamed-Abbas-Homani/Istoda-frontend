"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, User } from "lucide-react";
import { Card } from "@/components/ui";
import { Story } from "@/services/api";

interface StoryCardProps {
  story: Story;
  readersCount: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, readersCount }) => {
  return (
    <Link href={`/story/${story.id}`} className="block">
      <Card variant="neomorph" padding="none" className="overflow-hidden hover:shadow-neomorph-lg transition-all duration-300 cursor-pointer group">
        {/* Cover Image */}
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <Image
            src={`http://localhost:8000/uploads/${story.coverPhoto}`}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Story Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{story.author ? story.author.username : "Anonymous"}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{new Date(story.publishingDate).toLocaleDateString()}</span>
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{readersCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default StoryCard;
