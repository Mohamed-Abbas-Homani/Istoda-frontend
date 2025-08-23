"use client";
import React, { useEffect, useState } from "react";
import styles from "./StoriesFeed.module.css";
import { Story, useStore } from "@/app/services/store";
import StoryCard from "../StoryCard/StoryCard";

type StoriesByCategory = {
  [category: string]: Story[];
};

const StoriesFeed = () => {
  const [stories, setStories] = useState<StoriesByCategory>({});
  const { token } = useStore();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("http://localhost:8000/stories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        const data = await res.json();
        setStories(data);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
      }
    };

    fetchStories();
  }, [token]);

  return (
    <div className={styles.feedContainer}>
      {Object.keys(stories).map((category) => (
        <div key={category} className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>{category}</h2>
          <div className={styles.storiesRow}>
            {stories[category].map((story) => (
              <StoryCard key={story.id} story={story} readersCount={"toula"} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoriesFeed;
