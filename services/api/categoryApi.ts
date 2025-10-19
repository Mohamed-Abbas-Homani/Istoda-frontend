import { axiosInstance } from "./axiosInstance";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export const categoryApi = {
  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    const response = await axiosInstance.post<Category>("/categories", data);
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>("/categories");
    return response.data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get<Category>(`/categories/${id}`);
    return response.data;
  },

  updateCategory: async (
    id: string,
    data: UpdateCategoryData
  ): Promise<Category> => {
    const response = await axiosInstance.put<Category>(
      `/categories/${id}`,
      data
    );
    return response.data;
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
      `/categories/${id}`
    );
    return response.data;
  },
};
