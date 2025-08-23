"use client";
import React from "react";
import Layout from "../components/Layout/Layout";
import { useStore } from "../services/store";
import styles from "../components/Home/Home.module.css";
import UserWidget from "../components/Home/UserWidget/UserWidget";
import StoriesFeed from "../components/Home/StoriesFeed/StoriesFeed";

const HomePage = () => {
  const { user } = useStore();

  return (
    <Layout mode="protected">
      <div className={styles.container}>
        {/* Sidebar - 20% */}
        <div className={styles.sidebar}>
          {user && <UserWidget user={user} />}
        </div>

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
    </Layout>
  );
};

export default HomePage;
