import { axiosInstance } from "./axiosInstance";

export interface SignupData {
  username: string;
  email: string;
  password: string;
  profilePicture?: File;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    profilePicture: string;
  };
  token?: string;
  access_token?: string;
}

export const authApi = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.profilePicture) {
      formData.append("profilePicture", data.profilePicture);
    }

    const response = await axiosInstance.post<AuthResponse>(
      "/auth/signup",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      data
    );
    return response.data;
  },
};
