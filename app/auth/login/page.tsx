'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      console.log('Logged in:', data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const inputClass = "w-full p-3 mt-5 rounded-xl bg-background shadow-inner focus:shadow-[inset_2px_2px_3px_#d8d5cb,inset_-2px_-2px_3px_#ffffff] focus:outline-none transition";

  return (
    <Layout>
      <div
        className="max-w-md mx-auto mt-20 p-6 bg-background rounded-xl"
        style={{
          boxShadow: '7px 7px 13px #d8d5cb, -7px -7px 13px #ffffff, inset -2px -2px 3px #d8d5cb, inset 2px 2px 3px #ffffff',
        }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
          <button
            type="submit"
            className="w-full mt-5 text-background p-3 rounded-xl cursor-pointer hover:bg-emerald-600 transition"
            style={{background:"#7e22ce"}}
          >
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
}
