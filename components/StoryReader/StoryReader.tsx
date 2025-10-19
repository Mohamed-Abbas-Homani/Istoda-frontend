// app/components/StoryReader/StoryReader.tsx
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Star,
  MessageCircle,
  Book,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import styles from "./StoryReader.module.css";
import {
  useStoryStore,
  usePageStore,
  useCommentStore,
  useAuthStore,
} from "@/services/stores";
import { useNotificationStore } from "@/services/stores";

interface StoryReaderProps {
  storyId: string;
}

const StoryReader: React.FC<StoryReaderProps> = ({ storyId }) => {
  const { user } = useAuthStore();
  const {
    currentStory,
    currentStoryStats,
    getStoryById,
    getStoryStats,
    rateStory,
    updateReadingProgress,
  } = useStoryStore();
  const { pages, getPagesByStory } = usePageStore();
  const {
    comments,
    getCommentsByPage,
    createStoryComment,
    createPageComment,
    deleteComment,
    clearComments,
  } = useCommentStore();
  const { addNotification } = useNotificationStore();

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  // Initial load
  useEffect(() => {
    const loadStory = async () => {
      await getStoryById(storyId);
      await getStoryStats(storyId);
      await getPagesByStory(storyId);
    };
    loadStory();
  }, [storyId]);

  // Update user rating when story loads
  useEffect(() => {
    if (currentStory?.userRating) {
      setUserRating(currentStory.userRating);
    }
    return () => setUserRating(0);
  }, [currentStory?.userRating, currentStory?.id]);

  // Fetch comments when page changes
  useEffect(() => {
    const loadComments = async () => {
      if (pages.length > 0 && pages[currentPageIndex]) {
        const currentPage = pages[currentPageIndex];
        await getCommentsByPage(currentPage.id);
      } else {
        clearComments();
      }
    };
    loadComments();
  }, [currentPageIndex, pages.length]);

  const handleRating = async (rating: number) => {
    try {
      await rateStory(storyId, { rating });
      setUserRating(rating);
      addNotification("Rating submitted!", "success");
      // Refresh stats after rating
      await getStoryStats(storyId);
      // Re-fetch story to get updated data without losing fields
      await getStoryById(storyId);
    } catch (error) {
      addNotification("Failed to submit rating", "error");
    }
  };

  const handleNextPage = async () => {
    if (currentPageIndex < pages.length - 1) {
      const nextPageIndex = currentPageIndex + 1;
      const nextPage = pages[nextPageIndex];
      try {
        await updateReadingProgress(storyId, {
          currentPageNumber: nextPage.pageNumber,
        });
        setCurrentPageIndex(nextPageIndex);
        // Refresh stats to update reader count
        await getStoryStats(storyId);
      } catch (error) {
        addNotification("Failed to update reading progress", "error");
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      if (pages.length > 0 && currentPageIndex < pages.length) {
        await createPageComment(pages[currentPageIndex].id, {
          content: commentText,
        });
      } else {
        await createStoryComment(storyId, { content: commentText });
      }
      setCommentText("");
      addNotification("Comment added!", "success");
      // Refresh stats to update comment count
      await getStoryStats(storyId);
      // Reload comments for current page
      if (pages.length > 0 && pages[currentPageIndex]) {
        await getCommentsByPage(pages[currentPageIndex].id);
      }
    } catch (error) {
      addNotification("Failed to add comment", "error");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(commentId);
      addNotification("Comment deleted!", "success");
      // Refresh stats to update comment count
      await getStoryStats(storyId);
    } catch (error) {
      addNotification("Failed to delete comment", "error");
    }
  };

  if (!currentStory) {
    return <div className={styles.loading}>Loading story...</div>;
  }

  const currentPage = pages[currentPageIndex];

  return (
    <div className={styles.container}>
      {/* Story Header */}
      <div className={styles.header}>
        <div className={styles.coverSection}>
          <div className={styles.coverWrapper}>
            <Image
              src={`http://localhost:8000/uploads/${currentStory.coverPhoto}`}
              alt={`Cover photo for ${currentStory.title}`}
              fill
              className={styles.coverImage}
              priority
            />
          </div>
        </div>

        <div className={styles.storyInfo}>
          <h1 className={styles.title}>{currentStory.title}</h1>
          <p className={styles.description}>{currentStory.description}</p>

          <div className={styles.metaInfo}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                <Image
                  src={
                    currentStory.author?.profilePicture
                      ? `http://localhost:8000/uploads/${currentStory.author.profilePicture}`
                      : "/default.png"
                  }
                  alt={`${currentStory.author?.username || "Anonymous"} profile picture`}
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
              </div>
              <div>
                <p className={styles.authorName}>
                  {currentStory.author?.username || "Anonymous"}
                </p>
                <p className={styles.publishDate}>
                  {new Date(currentStory.publishingDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <Book size={16} />
                <span>{currentStoryStats?.readersCount || 0} readers</span>
              </div>
              <div className={styles.statItem}>
                <Star size={16} />
                <span>
                  {currentStoryStats?.averageRating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <div className={styles.statItem}>
                <MessageCircle size={16} />
                <span>{currentStoryStats?.commentsCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className={styles.ratingSection}>
            <p className={styles.ratingLabel}>Rate this story:</p>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={`${styles.star} ${star <= userRating ? styles.starFilled : ""}`}
                  onClick={() => handleRating(star)}
                  fill={star <= userRating ? "currentColor" : "none"}
                />
              ))}
            </div>
            {userRating > 0 && (
              <span className={styles.yourRating}>
                Your rating: {userRating}/5
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Reading Section */}
      <div className={styles.readingSection}>
        <div className={styles.pageContent}>
          {pages.length > 0 ? (
            <>
              <div className={styles.pageHeader}>
                <span className={styles.pageNumber}>
                  Page {currentPageIndex + 1} of {pages.length}
                </span>
              </div>
              <div className={styles.content}>
                {currentPage?.content || "No content available"}
              </div>
            </>
          ) : (
            <div className={styles.content}>{currentStory.content}</div>
          )}
        </div>

        {/* Navigation */}
        {pages.length > 0 && (
          <div className={styles.navigation}>
            <button
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              className={styles.navButton}
            >
              <ChevronLeft size={20} /> Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPageIndex === pages.length - 1}
              className={styles.navButton}
            >
              Next <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className={styles.commentsSection}>
        <button
          onClick={() => setShowComments(!showComments)}
          className={styles.commentsToggle}
        >
          <MessageCircle size={20} />
          {showComments
            ? "Hide Comments"
            : `Show Comments (${comments.length})`}
        </button>

        {showComments && (
          <div className={styles.commentsContainer}>
            <form onSubmit={handleSubmitComment} className={styles.commentForm}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className={styles.commentInput}
                rows={3}
                required
              />
              <button type="submit" className={styles.commentSubmit}>
                Post Comment
              </button>
            </form>

            <div className={styles.commentsList}>
              {comments.length === 0 ? (
                <p className={styles.noComments}>
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className={styles.comment}>
                    <div className={styles.commentHeader}>
                      <div className={styles.commentUser}>
                        <Image
                          src={
                            comment.user.profilePicture
                              ? `http://localhost:8000/uploads/${comment.user.profilePicture}`
                              : "/default.png"
                          }
                          alt={`${comment.user.username} profile picture`}
                          width={32}
                          height={32}
                          className={styles.commentAvatar}
                        />
                        <div>
                          <p className={styles.commentAuthor}>
                            {comment.user.username}
                          </p>
                          <p className={styles.commentDate}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {user?.id === comment.user.id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className={styles.deleteButton}
                          title="Delete comment"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className={styles.commentContent}>{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryReader;
