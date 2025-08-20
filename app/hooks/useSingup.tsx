'use client';
import { useState } from 'react';
import { useStore } from '../services/store';
import { useRouter } from 'next/navigation';

export function useSignup() {
  const {setUser, addNotification} = useStore()
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (profilePic) formData.append('profile_picture', profilePic);

      const res = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        addNotification('Signup failed!', "error")
      return
    }
      addNotification('Account created successfully!', "success");
      const user = await res.json()
      setUser(user)
        router.push("/auth/login")

    } catch (err: any) {
      addNotification(err.message, "error");
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
  };
}
