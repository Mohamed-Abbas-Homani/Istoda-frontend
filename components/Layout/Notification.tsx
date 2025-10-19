"use client";
import { useNotificationStore } from "@/services/stores";
import styles from "./Notification.module.css";

export default function Notification() {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <div className={styles.container}>
      {notifications.map((n) => (
        <div key={n.id} className={`${styles.notification} ${styles[n.type]}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
}
