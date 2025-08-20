import React from "react";
import styles from "./UserWidget.module.css";
import Image from "next/image";

interface UserData {
  id: string;
  username: string;
  email: string;
  profile_picture?: string;
  followers_count?: number;
  following_count?: number;
  stories_read?: number;
  stories_written?: number;
}

interface UserWidgetProps {
  user: UserData;
}

const UserWidget: React.FC<UserWidgetProps> = ({ user }) => {
  // Default values if data is not available
  const {
    username,
    email,
    profile_picture,
    followers_count = 0,
    following_count = 0,
    stories_read = 0,
    stories_written = 0,
  } = user;

  return (
    <div className={styles.widget}>
      <div className={styles.profileSection}>
        <div className={styles.profilePic}>
          <Image
            src={
              profile_picture
                ? `http://localhost:8000/uploads/${profile_picture}`
                : "/default.png"
            }
            alt={`${username}'s profile`}
            className={styles.profileImage}
            width={100}
            height={100}
          />
        </div>

        <div className={styles.userInfo}>
          <h2 className={styles.username}>{username}</h2>
          <p className={styles.email}>{email}</p>
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* Social Stats */}
      <div className={styles.socialStats}>
        <div className={styles.socialCard}>
          <div className={styles.socialNumber}>{followers_count}</div>
          <div className={styles.socialLabel}>Followers</div>
        </div>
        <div className={styles.socialCard}>
          <div className={styles.socialNumber}>{following_count}</div>
          <div className={styles.socialLabel}>Following</div>
        </div>
      </div>

      {/* Story Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stories_read}</div>
          <div className={styles.statLabel}>Stories Read</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stories_written}</div>
          <div className={styles.statLabel}>Stories Written</div>
        </div>
      </div>
    </div>
  );
};

export default UserWidget;
