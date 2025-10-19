"use client";
import { useState } from "react";
import { useAuthStore } from "../services/stores";
import { useNotificationStore } from "../services/stores";
import { useRouter } from "next/navigation";

export function useLogin() {
  const { login, isLoading } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      addNotification("Login successful!", "success");
      router.push("/home");
    } catch (err: any) {
      addNotification(err.message || "Login failed!", "error");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isLoading,
  };
}
