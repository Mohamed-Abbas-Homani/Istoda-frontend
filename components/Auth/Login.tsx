"use client";
import { useLogin } from "@/hooks/useLogin";
import styles from "./Auth.module.css";

export default function Login() {
  const { email, setEmail, password, setPassword, handleSubmit } = useLogin();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
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
        <button type="submit" className={styles.submit}>
          Login
        </button>
      </form>
    </div>
  );
}
