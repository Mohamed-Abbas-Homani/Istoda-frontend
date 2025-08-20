"use client";

import Image from "next/image";
import { useStore } from "@/app/services/store";
import { useRouter } from "next/navigation";
import styles from "./Welcome.module.css";

export default function Welcome() {
  const { token } = useStore();
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Left Side - Welcome Image */}
      <div className={styles.left}>
        <Image
          src="/welcome.png"
          alt="Welcome Illustration"
          fill
          className={styles.image}
          priority
        />
      </div>

      {/* Right Side */}
      <div className={styles.right}>
        <Image
          src="/istoda.png"
          alt="Istoda Logo"
          width={220}
          height={220}
          className={styles.logo}
        />

        <p className={styles.tagline}>
          A platform where stories come alive. <br />
          Read and write short stories that will live forever.
        </p>

        <button
          onClick={() => router.push(!token ? "/auth/login" : "/home")}
          className={styles.loginButton}
        >
          Start your journey
        </button>
      </div>
    </div>
  );
}
