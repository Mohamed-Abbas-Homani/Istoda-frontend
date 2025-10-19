"use client";
import React from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import styles from "./StoryCard.module.css";
import { Story } from "@/services/api";
import Link from "next/link";

interface StoryCardProps {
  story: Story;
  readersCount: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, readersCount }) => {
  return (
    <Link href={`/story/${story.id}`}>
      <div className={styles.storyCard}>
        <div className={styles.coverWrapper}>
          <Image
            src={`http://localhost:8000/uploads/${story.coverPhoto}`}
            alt={story.title}
            fill
            className={styles.coverPhoto}
          />
        </div>
        <div className={styles.storyInfo}>
          <span className={styles.storyAuthor}>
            {story.author ? story.author.username : "Anonymous"}
          </span>
          <div className={styles.metaRow}>
            <span className={styles.storyDate}>
              {new Date(story.publishingDate).toLocaleDateString()}
            </span>
            <div className={styles.readers}>
              <Eye size={16} className={styles.eyeIcon} />
              <span>{readersCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
