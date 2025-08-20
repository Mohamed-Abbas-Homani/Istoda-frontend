'use client';
import { useState } from 'react';
import { useStore } from '../services/store';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const {setToken, addNotification, setUser} = useStore()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok){
      addNotification("Login failed!", "error")
      return
      }

      const data = await res.json();
      addNotification("Login successful!", "success")
      setToken(data["access_token"])
      setUser(data["user"])
      router.push("/home")
    } catch (err: any) {
      addNotification(err.message, "error");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
  };
}
