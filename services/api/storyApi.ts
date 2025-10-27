import { axiosInstance } from "./axiosInstance";

export interface Story {
  id: string;
  title: string;
  coverPhoto: string;
  content: string;
  description?: string;
  categories: {
    id: string;
    name: string;
    description?: string;
    color: string;
  }[];
  publishingDate: string;
  author: {
    id: string;
    username: string;
    email: string;
    profilePicture: string;
  } | null;
  averageRating?: number;
  userRating?: number;
  readersCount?: number;
  commentsCount?: number;
}

export interface CreateStoryData {
  title: string;
  description?: string;
  categoryIds: string[];
  coverPhoto?: File;
}

export interface UpdateStoryData {
  title?: string;
  content?: string;
  description?: string;
  categoryIds?: string[];
  coverPhoto?: File;
}

export interface RateStoryData {
  rating: number;
}

export interface Page {
  id: string;
  pageNumber: number;
  content: string;
  storyId: string;
}

export interface CreatePageData {
  pageNumber: number;
  content: string;
}

export interface UpdatePageData {
  pageNumber?: number;
  content?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    profilePicture: string;
  };
}

export interface CreateCommentData {
  content: string;
}

export interface UpdateReadingProgressData {
  currentPageNumber: number;
}

export interface StoryStats {
  readersCount: number;
  averageRating: number;
  commentsCount: number;
}

export type StoriesGroupedByCategory = {
  [categoryName: string]: Story[];
};

export const storyApi = {
  // Story endpoints
  createStory: async (data: CreateStoryData): Promise<Story> => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    formData.append("categoryIds", data.categoryIds.join(","));
    if (data.coverPhoto) formData.append("coverPhoto", data.coverPhoto);

    const response = await axiosInstance.post<Story>("/stories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getStories: async (
    keyword?: string,
    categoryId?: string
  ): Promise<Story[]> => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (categoryId) params.append("categoryId", categoryId);

    const response = await axiosInstance.get<Story[]>("/stories", { params });
    return response.data;
  },

  getStoriesGroupedByCategory: async (
    keyword?: string
  ): Promise<StoriesGroupedByCategory> => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);

    const response = await axiosInstance.get<StoriesGroupedByCategory>(
      "/stories/grouped-by-category",
      { params }
    );
    return response.data;
  },

  getStoryById: async (id: string): Promise<Story> => {
    const response = await axiosInstance.get<Story>(`/stories/${id}`);
    return response.data;
  },

  updateStory: async (id: string, data: UpdateStoryData): Promise<Story> => {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.content) formData.append("content", data.content);
    if (data.description) formData.append("description", data.description);
    if (data.categoryIds) formData.append("categoryIds", data.categoryIds.join(","));
    if (data.coverPhoto) formData.append("coverPhoto", data.coverPhoto);

    const response = await axiosInstance.put<Story>(
      `/stories/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteStory: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
      `/stories/${id}`
    );
    return response.data;
  },

  rateStory: async (id: string, data: RateStoryData): Promise<Story> => {
    const response = await axiosInstance.post<Story>(
      `/stories/${id}/rate`,
      data
    );
    return response.data;
  },

  updateReadingProgress: async (
    id: string,
    data: UpdateReadingProgressData
  ): Promise<void> => {
    await axiosInstance.post(`/stories/${id}/reading-progress`, data);
  },

  getStoryStats: async (id: string): Promise<StoryStats> => {
    const response = await axiosInstance.get<StoryStats>(
      `/stories/${id}/stats`
    );
    return response.data;
  },

  // Page endpoints
  createPage: async (storyId: string, data: CreatePageData): Promise<Page> => {
    const response = await axiosInstance.post<Page>(
      `/stories/${storyId}/pages`,
      data
    );
    return response.data;
  },

  getPagesByStory: async (storyId: string): Promise<Page[]> => {
    const response = await axiosInstance.get<Page[]>(
      `/stories/${storyId}/pages`
    );
    return response.data;
  },

  getPageById: async (pageId: string): Promise<Page> => {
    const response = await axiosInstance.get<Page>(`/stories/pages/${pageId}`);
    return response.data;
  },

  updatePage: async (pageId: string, data: UpdatePageData): Promise<Page> => {
    const response = await axiosInstance.put<Page>(
      `/stories/pages/${pageId}`,
      data
    );
    return response.data;
  },

  deletePage: async (pageId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
      `/stories/pages/${pageId}`
    );
    return response.data;
  },

  // Comment endpoints
  createStoryComment: async (
    storyId: string,
    data: CreateCommentData
  ): Promise<Comment> => {
    const response = await axiosInstance.post<Comment>(
      `/stories/${storyId}/comments`,
      data
    );
    return response.data;
  },

  createPageComment: async (
    pageId: string,
    data: CreateCommentData
  ): Promise<Comment> => {
    const response = await axiosInstance.post<Comment>(
      `/stories/pages/${pageId}/comments`,
      data
    );
    return response.data;
  },

  getCommentsByPage: async (pageId: string): Promise<Comment[]> => {
    const response = await axiosInstance.get<Comment[]>(
      `/stories/pages/${pageId}/comments`
    );
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
      `/stories/comments/${commentId}`
    );
    return response.data;
  },
};
