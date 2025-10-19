"use client";
import React from "react";
import styles from "./Home.module.css";
import UserWidget from "./UserWidget/UserWidget";
import StoriesFeed from "./StoriesFeed/StoriesFeed";
import { useAuthStore } from "@/app/services/stores";

const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className={styles.container}>
      {/* Sidebar - 20% */}
      <div className={styles.sidebar}>{user && <UserWidget user={user} />}</div>

      {/* Main content - 65% */}
      <div className={styles.mainContent}>
        <StoriesFeed />
      </div>

      {/* Networks - 15% */}
      <div className={styles.networks}>
        <h1 className={styles.htop}>Networks</h1>
        <p>Connections, trending users, etc.</p>
      </div>
    </div>
  );
};

export default Home;
