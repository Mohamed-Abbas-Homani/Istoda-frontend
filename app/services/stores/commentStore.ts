import { create } from "zustand";
import { storyApi, Comment, CreateCommentData } from "../api";

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
}

interface CommentActions {
  getCommentsByPage: (pageId: string) => Promise<Comment[]>;
  createStoryComment: (
    storyId: string,
    data: CreateCommentData
  ) => Promise<Comment>;
  createPageComment: (
    pageId: string,
    data: CreateCommentData
  ) => Promise<Comment>;
  deleteComment: (commentId: string) => Promise<void>;
  clearComments: () => void;
  clearError: () => void;
}

type CommentStore = CommentState & CommentActions;

export const useCommentStore = create<CommentStore>((set) => ({
  // State
  comments: [],
  isLoading: false,
  error: null,

  // Actions
  getCommentsByPage: async (pageId: string) => {
    set({ isLoading: true, error: null });
    try {
      const comments = await storyApi.getCommentsByPage(pageId);
      set({ comments, isLoading: false });
      return comments;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch comments",
        isLoading: false,
      });
      throw error;
    }
  },

  createStoryComment: async (storyId: string, data: CreateCommentData) => {
    set({ isLoading: true, error: null });
    try {
      const comment = await storyApi.createStoryComment(storyId, data);
      set((state) => ({
        comments: [...state.comments, comment],
        isLoading: false,
      }));
      return comment;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create comment",
        isLoading: false,
      });
      throw error;
    }
  },

  createPageComment: async (pageId: string, data: CreateCommentData) => {
    set({ isLoading: true, error: null });
    try {
      const comment = await storyApi.createPageComment(pageId, data);
      set((state) => ({
        comments: [...state.comments, comment],
        isLoading: false,
      }));
      return comment;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create comment",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteComment: async (commentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await storyApi.deleteComment(commentId);
      set((state) => ({
        comments: state.comments.filter((c) => c.id !== commentId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete comment",
        isLoading: false,
      });
      throw error;
    }
  },

  clearComments: () => {
    set({ comments: [] });
  },

  clearError: () => {
    set({ error: null });
  },
}));
