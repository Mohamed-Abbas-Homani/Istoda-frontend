"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar/Navbar";
import styles from "./Layout.module.css";
import Notification from "./Notification";
import { useAuthStore } from "@/app/services/stores";

type LayoutMode = "protected" | "notProtected" | "public";

type LayoutProps = {
  children: React.ReactNode;
  mode?: LayoutMode; // default = "public"
  withNav?: boolean;
};

// Loading component for auth checks
function AuthLoading() {
  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "18px",
          }}
        >
          Loading...
        </div>
      </div>
    </div>
  );
}

export default function Layout({
  children,
  mode = "public",
  withNav = true,
}: LayoutProps) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication logic after client-side hydration
  useEffect(() => {
    if (!isClient) return;

    // For public pages, no auth check needed
    if (mode === "public") {
      setAuthChecked(true);
      return;
    }

    if (mode === "protected" && !token) {
      router.replace("/auth/login");
      return;
    }

    if (mode === "notProtected" && token) {
      router.push("/home");
      return;
    }

    setAuthChecked(true);
  }, [token, router, isClient]);

  // Show consistent layout during SSR
  if (!isClient) {
    return (
      <div className={styles.layout}>
        <Navbar />
        <main className={styles.main}>{children}</main>
        <Notification />
      </div>
    );
  }

  // Show loading during auth check for protected/notProtected routes
  if (!authChecked && mode !== "public") {
    return <AuthLoading />;
  }
  return (
    <div
      className={styles.layout}
      style={{ padding: `${withNav ? "1.2rem 0.1rem 0.1rem 0" : 0}` }}
    >
      {withNav && <Navbar />}
      <main className={styles.main}>{children}</main>
      <Notification />
    </div>
  );
}
