"use client";
import { useStore } from "@/app/services/store";
import styles from "./Notification.module.css";

export default function Notification() {
  const notifications = useStore((state) => state.notifications);

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
