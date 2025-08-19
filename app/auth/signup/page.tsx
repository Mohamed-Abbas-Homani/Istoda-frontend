'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (profilePic) formData.append('profilePic', profilePic);

      const res = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Signup failed');
      setSuccess('Account created successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const inputClass = "w-full p-3 mt-5 rounded-xl bg-background shadow-inner focus:outline-none focus:shadow-[inset_2px_2px_3px_#d8d5cb,inset_-2px_-2px_3px_#ffffff] transition";

  return (
    <Layout>
      <div
        className="max-w-md mx-auto mt-20 p-6 bg-background rounded-xl"
        style={{
          boxShadow: '7px 7px 13px #d8d5cb, -7px -7px 13px #ffffff, inset -2px -2px 3px #d8d5cb, inset 2px 2px 3px #ffffff',
        }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
            required
          />
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

          {/* Profile Picture Upload */}
          <div className="mt-5">
            <p className="text-center mb-2 font-medium">Profile Picture</p>
            <div className="flex justify-center">
              <label
                htmlFor="profilePic"
                className="w-24 h-24 rounded-full bg-background flex items-center justify-center cursor-pointer shadow-inner hover:shadow-[inset_2px_2px_5px_#d8d5cb,inset_-2px_-2px_5px_#ffffff] transition"
              >
                {profilePic ? (
                  <img
                    src={URL.createObjectURL(profilePic)}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-gray-400">Upload</span>
                )}
              </label>
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProfilePic(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-5 bg-emerald-800 text-background p-3 rounded-xl cursor-pointer hover:bg-emerald-600 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </Layout>
  );
}
