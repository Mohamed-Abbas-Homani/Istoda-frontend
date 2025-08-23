"use client";
import React from "react";
import Image from "next/image";
import { FiEye } from "react-icons/fi";
import styles from "./StoryCard.module.css";
import { Story } from "@/app/services/store";

interface StoryCardProps {
  story: Story;
  readersCount: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, readersCount }) => {
  return (
    <div className={styles.storyCard}>
      <div className={styles.coverWrapper}>
        <Image
          src={`http://localhost:8000/uploads/${story.cover_photo}`}
          alt={story.title}
          fill
          className={styles.coverPhoto}
        />
      </div>
      <div className={styles.storyInfo}>
        <span className={styles.storyAuthor}>
          {story.user ? story.user.username : "Anonymous"}
        </span>
        <div className={styles.metaRow}>
          <span className={styles.storyDate}>
            {new Date(story.publishingDate).toLocaleDateString()}
          </span>
          <div className={styles.readers}>
            <FiEye className={styles.eyeIcon} />
            <span>{readersCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
