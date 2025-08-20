"use client";
import React from 'react'
import Layout from '../components/Layout/Layout'
import { useStore } from '../services/store'
import styles from '../components/Home/Home.module.css'
import UserWidget from '../components/Home/UserWidget/UserWidget'

const HomePage = () => {
  const { user } = useStore()

  return (
    <Layout mode='protected'>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          {user && <UserWidget user={user} />}
        </div>
        <div className={styles.content}>
          {/* Main content area - 70% width */}
          <div className={styles.mainContent}>
            <h1>Welcome to Your Dashboard</h1>
            <p>Your stories and content will appear here...</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage