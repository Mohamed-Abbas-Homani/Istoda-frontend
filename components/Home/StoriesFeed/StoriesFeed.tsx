"use client";
import React, { useEffect } from "react";
import { useStoryStore } from "@/services/stores";
import StoryCard from "../StoryCard/StoryCard";
import { Card } from "@/components/ui";

const StoriesFeed = () => {
  const { storiesGrouped, getStoriesGroupedByCategory, isLoading } = useStoryStore();

  useEffect(() => {
    getStoriesGroupedByCategory();
  }, [getStoriesGroupedByCategory]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (Object.keys(storiesGrouped).length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p className="text-muted-foreground">No stories available yet.</p>
      </div>
    );
  }

  return (
    <Card variant="neomorph" padding="lg" className="w-full">
      <div className="space-y-8">
        {Object.keys(storiesGrouped).map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">
              {category}
            </h2>
            <Card variant="neomorph" inset padding="lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {storiesGrouped[category].map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    readersCount={story.readersCount?.toString() || "0"}
                  />
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StoriesFeed;
