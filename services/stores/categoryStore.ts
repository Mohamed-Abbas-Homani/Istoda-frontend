import { create } from "zustand";
import {
  categoryApi,
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "../api";

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

interface CategoryActions {
  createCategory: (data: CreateCategoryData) => Promise<Category>;
  getCategories: () => Promise<void>;
  getCategoryById: (id: string) => Promise<void>;
  updateCategory: (id: string, data: UpdateCategoryData) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  clearCurrentCategory: () => void;
  clearError: () => void;
}

type CategoryStore = CategoryState & CategoryActions;

export const useCategoryStore = create<CategoryStore>((set) => ({
  // State
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,

  // Actions
  createCategory: async (data: CreateCategoryData) => {
    set({ isLoading: true, error: null });
    try {
      const category = await categoryApi.createCategory(data);
      set((state) => ({
        categories: [...state.categories, category],
        isLoading: false,
      }));
      return category;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create category",
        isLoading: false,
      });
      throw error;
    }
  },

  getCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryApi.getCategories();
      set({ categories, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch categories",
        isLoading: false,
      });
      throw error;
    }
  },

  getCategoryById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const currentCategory = await categoryApi.getCategoryById(id);
      set({ currentCategory, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch category",
        isLoading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id: string, data: UpdateCategoryData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCategory = await categoryApi.updateCategory(id, data);
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? updatedCategory : c
        ),
        currentCategory:
          state.currentCategory?.id === id
            ? updatedCategory
            : state.currentCategory,
        isLoading: false,
      }));
      return updatedCategory;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update category",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await categoryApi.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        currentCategory:
          state.currentCategory?.id === id ? null : state.currentCategory,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete category",
        isLoading: false,
      });
      throw error;
    }
  },

  clearCurrentCategory: () => {
    set({ currentCategory: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
