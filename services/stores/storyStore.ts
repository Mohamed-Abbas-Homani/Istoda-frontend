import { create } from "zustand";
import {
  storyApi,
  Story,
  CreateStoryData,
  UpdateStoryData,
  RateStoryData,
  UpdateReadingProgressData,
  StoryStats,
  StoriesGroupedByCategory,
} from "../api";

interface StoryState {
  stories: Story[];
  storiesGrouped: StoriesGroupedByCategory;
  currentStory: Story | null;
  currentStoryStats: StoryStats | null;
  isLoading: boolean;
  error: string | null;
}

interface StoryActions {
  createStory: (data: CreateStoryData) => Promise<Story>;
  getStories: (keyword?: string, categoryId?: string) => Promise<void>;
  getStoriesGroupedByCategory: (keyword?: string) => Promise<void>;
  getStoryById: (id: string) => Promise<void>;
  updateStory: (id: string, data: UpdateStoryData) => Promise<Story>;
  deleteStory: (id: string) => Promise<void>;
  rateStory: (id: string, data: RateStoryData) => Promise<void>;
  updateReadingProgress: (id: string, data: UpdateReadingProgressData) => Promise<void>;
  getStoryStats: (id: string) => Promise<void>;
  clearCurrentStory: () => void;
  clearError: () => void;
}

type StoryStore = StoryState & StoryActions;

export const useStoryStore = create<StoryStore>((set, get) => ({
  // State
  stories: [],
  storiesGrouped: {},
  currentStory: null,
  currentStoryStats: null,
  isLoading: false,
  error: null,

  // Actions
  createStory: async (data: CreateStoryData) => {
    set({ isLoading: true, error: null });
    try {
      const story = await storyApi.createStory(data);
      set((state) => ({
        stories: [...state.stories, story],
        isLoading: false,
      }));
      return story;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create story",
        isLoading: false,
      });
      throw error;
    }
  },

  getStories: async (keyword?: string, categoryId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const stories = await storyApi.getStories(keyword, categoryId);
      set({ stories, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch stories",
        isLoading: false,
      });
      throw error;
    }
  },

  getStoriesGroupedByCategory: async (keyword?: string) => {
    set({ isLoading: true, error: null });
    try {
      const storiesGrouped =
        await storyApi.getStoriesGroupedByCategory(keyword);
      set({ storiesGrouped, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch stories",
        isLoading: false,
      });
      throw error;
    }
  },

  getStoryById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const currentStory = await storyApi.getStoryById(id);
      set({ currentStory, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch story",
        isLoading: false,
      });
      throw error;
    }
  },

  updateStory: async (id: string, data: UpdateStoryData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedStory = await storyApi.updateStory(id, data);
      set((state) => ({
        stories: state.stories.map((s) => (s.id === id ? updatedStory : s)),
        currentStory:
          state.currentStory?.id === id ? updatedStory : state.currentStory,
        isLoading: false,
      }));
      return updatedStory;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update story",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteStory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await storyApi.deleteStory(id);
      set((state) => ({
        stories: state.stories.filter((s) => s.id !== id),
        currentStory: state.currentStory?.id === id ? null : state.currentStory,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete story",
        isLoading: false,
      });
      throw error;
    }
  },

  rateStory: async (id: string, data: RateStoryData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedStory = await storyApi.rateStory(id, data);
      set((state) => ({
        stories: state.stories.map((s) => (s.id === id ? updatedStory : s)),
        currentStory:
          state.currentStory?.id === id ? updatedStory : state.currentStory,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to rate story",
        isLoading: false,
      });
      throw error;
    }
  },

  updateReadingProgress: async (id: string, data: UpdateReadingProgressData) => {
    set({ isLoading: true, error: null });
    try {
      await storyApi.updateReadingProgress(id, data);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update reading progress",
        isLoading: false,
      });
      throw error;
    }
  },

  getStoryStats: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const currentStoryStats = await storyApi.getStoryStats(id);
      set({ currentStoryStats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch story stats",
        isLoading: false,
      });
      throw error;
    }
  },

  clearCurrentStory: () => {
    set({ currentStory: null, currentStoryStats: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
