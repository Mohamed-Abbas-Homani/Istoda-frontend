"use client";
import { useState } from "react";
import { useAuthStore } from "../services/stores";
import { useNotificationStore } from "../services/stores";
import { useRouter } from "next/navigation";

export function useSignup() {
  const { signup, isLoading } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({
        username,
        email,
        password,
        profilePicture: profilePic || undefined,
      });
      addNotification("Account created successfully!", "success");
      router.push("/auth/login");
    } catch (err: any) {
      addNotification(err.message || "Signup failed!", "error");
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    profilePic,
    setProfilePic,
    handleSubmit,
    isLoading,
  };
}
