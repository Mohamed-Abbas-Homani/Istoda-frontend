"use client";
import React, { useEffect } from "react";
import styles from "./StoriesFeed.module.css";
import { useStoryStore } from "@/app/services/stores";
import StoryCard from "../StoryCard/StoryCard";

const StoriesFeed = () => {
  const { storiesGrouped, getStoriesGroupedByCategory, isLoading } =
    useStoryStore();

  useEffect(() => {
    getStoriesGroupedByCategory();
  }, []);

  if (isLoading) {
    return <div className={styles.feedContainer}>Loading stories...</div>;
  }

  return (
    <div className={styles.feedContainer}>
      {Object.keys(storiesGrouped).map((category) => (
        <div key={category} className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>{category}</h2>
          <div className={styles.storiesRow}>
            {storiesGrouped[category].map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                readersCount={story.readersCount?.toString() || "0"}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoriesFeed;
