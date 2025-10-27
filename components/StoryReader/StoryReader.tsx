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
  User,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  useStoryStore,
  usePageStore,
  useCommentStore,
  useAuthStore,
  useNotificationStore,
} from "@/services/stores";
import { Card, CardHeader, CardTitle, CardContent, Button, Textarea, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

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
  }, [storyId, getStoryById, getStoryStats, getPagesByStory]);

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
  }, [currentPageIndex, pages, getCommentsByPage, clearComments]);

  const handleRating = async (rating: number) => {
    try {
      await rateStory(storyId, { rating });
      setUserRating(rating);
      addNotification("Rating submitted!", "success");
      await getStoryStats(storyId);
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
      await getStoryStats(storyId);
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
      await getStoryStats(storyId);
    } catch (error) {
      addNotification("Failed to delete comment", "error");
    }
  };

  if (!currentStory) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading story...</p>
        </div>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];

  return (
    <div className="min-h-screen w-full px-4 md:px-6 lg:px-8 py-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Story Header */}
        <Card variant="neomorph" padding="lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cover Photo */}
            <div className="md:col-span-1">
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-neomorph">
                <Image
                  src={`http://localhost:8000/uploads/${currentStory.coverPhoto}`}
                  alt={`Cover photo for ${currentStory.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Story Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                  {currentStory.title}
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {currentStory.description}
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src={
                      currentStory.author?.profilePicture
                        ? `http://localhost:8000/uploads/${currentStory.author.profilePicture}`
                        : "/default.png"
                    }
                    alt={`${currentStory.author?.username || "Anonymous"} profile`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {currentStory.author?.username || "Anonymous"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentStory.publishingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Book className="h-4 w-4 text-info" />
                  <span className="text-muted-foreground">
                    {currentStoryStats?.readersCount || 0} readers
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-warning" />
                  <span className="text-muted-foreground">
                    {currentStoryStats?.averageRating?.toFixed(1) || "0.0"} rating
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">
                    {currentStoryStats?.commentsCount || 0} comments
                  </span>
                </div>
              </div>

              {/* Rating Section */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Rate this story:</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-7 w-7 transition-colors",
                          star <= userRating
                            ? "text-warning fill-warning"
                            : "text-muted-foreground hover:text-warning"
                        )}
                      />
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Your rating: {userRating}/5
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Reading Section */}
        <Card variant="neomorph" padding="lg">
          <CardContent className="space-y-6">
            {pages.length > 0 ? (
              <>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <Badge variant="primary">
                    Page {currentPageIndex + 1} of {pages.length}
                  </Badge>
                </div>
                <div className="prose prose-sm md:prose-base max-w-none">
                  <ReactMarkdown>
                    {currentPage?.content || "No content available"}
                  </ReactMarkdown>
                </div>
              </>
            ) : (
              <div className="prose prose-sm md:prose-base max-w-none">
                {currentStory.content || "No content available"}
              </div>
            )}

            {/* Navigation */}
            {pages.length > 0 && (
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPageIndex === 0}
                  variant="outline"
                  size="md"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPageIndex === pages.length - 1}
                  variant="primary"
                  size="md"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card variant="neomorph" padding="lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments ({comments.length})
              </CardTitle>
              <Button
                onClick={() => setShowComments(!showComments)}
                variant="ghost"
                size="sm"
              >
                {showComments ? "Hide" : "Show"}
              </Button>
            </div>
          </CardHeader>

          {showComments && (
            <CardContent className="space-y-6">
              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  required
                />
                <Button type="submit" variant="primary" size="md">
                  Post Comment
                </Button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 rounded-lg bg-muted/30 border border-border space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                            <Image
                              src={
                                comment.user.profilePicture
                                  ? `http://localhost:8000/uploads/${comment.user.profilePicture}`
                                  : "/default.png"
                              }
                              alt={`${comment.user.username} profile`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {comment.user.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {user?.id === comment.user.id && (
                          <Button
                            onClick={() => handleDeleteComment(comment.id)}
                            variant="ghost"
                            size="sm"
                            className="text-error hover:bg-error/10"
                            title="Delete comment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StoryReader;
