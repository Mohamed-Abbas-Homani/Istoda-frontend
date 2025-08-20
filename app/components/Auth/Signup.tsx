"use client";
import { useSignup } from "@/app/hooks/useSingup";
import styles from "./Auth.module.css";

export default function Signup() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    profilePic,
    setProfilePic,
    handleSubmit,
  } = useSignup();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign Up</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />

        {/* Profile Picture Upload */}
        <div className={styles.profileSection}>
          <p className={styles.profileLabel}>Profile Picture</p>
          <div className={styles.profileUpload}>
            <label htmlFor="profilePic" className={styles.profilePic}>
              {profilePic ? (
                <img
                  src={URL.createObjectURL(profilePic)}
                  alt="Profile"
                  className={styles.profileImage}
                />
              ) : (
                <span className={styles.uploadText}>Upload</span>
              )}
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setProfilePic(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
