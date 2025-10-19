import { create } from "zustand";
import { storyApi, Page, CreatePageData, UpdatePageData } from "../api";

interface PageState {
  pages: Page[];
  currentPage: Page | null;
  isLoading: boolean;
  error: string | null;
}

interface PageActions {
  createPage: (storyId: string, data: CreatePageData) => Promise<Page>;
  getPagesByStory: (storyId: string) => Promise<void>;
  getPageById: (pageId: string) => Promise<void>;
  updatePage: (pageId: string, data: UpdatePageData) => Promise<Page>;
  deletePage: (pageId: string) => Promise<void>;
  clearCurrentPage: () => void;
  clearError: () => void;
}

type PageStore = PageState & PageActions;

export const usePageStore = create<PageStore>((set) => ({
  // State
  pages: [],
  currentPage: null,
  isLoading: false,
  error: null,

  // Actions
  createPage: async (storyId: string, data: CreatePageData) => {
    set({ isLoading: true, error: null });
    try {
      const page = await storyApi.createPage(storyId, data);
      set((state) => ({
        pages: [...state.pages, page],
        isLoading: false,
      }));
      return page;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create page",
        isLoading: false,
      });
      throw error;
    }
  },

  getPagesByStory: async (storyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const pages = await storyApi.getPagesByStory(storyId);
      set({ pages, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch pages",
        isLoading: false,
      });
      throw error;
    }
  },

  getPageById: async (pageId: string) => {
    set({ isLoading: true, error: null });
    try {
      const currentPage = await storyApi.getPageById(pageId);
      set({ currentPage, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch page",
        isLoading: false,
      });
      throw error;
    }
  },

  updatePage: async (pageId: string, data: UpdatePageData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPage = await storyApi.updatePage(pageId, data);
      set((state) => ({
        pages: state.pages.map((p) => (p.id === pageId ? updatedPage : p)),
        currentPage:
          state.currentPage?.id === pageId ? updatedPage : state.currentPage,
        isLoading: false,
      }));
      return updatedPage;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update page",
        isLoading: false,
      });
      throw error;
    }
  },

  deletePage: async (pageId: string) => {
    set({ isLoading: true, error: null });
    try {
      await storyApi.deletePage(pageId);
      set((state) => ({
        pages: state.pages.filter((p) => p.id !== pageId),
        currentPage:
          state.currentPage?.id === pageId ? null : state.currentPage,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete page",
        isLoading: false,
      });
      throw error;
    }
  },

  clearCurrentPage: () => {
    set({ currentPage: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
