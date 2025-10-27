"use client";
import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useNotificationStore } from "@/services/stores";
import { cn } from "@/lib/utils";

export default function Notification() {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colorMap = {
    success: "bg-success/10 border-success text-success-foreground",
    error: "bg-error/10 border-error text-error-foreground",
    info: "bg-info/10 border-info text-info-foreground",
    warning: "bg-warning/10 border-warning text-warning-foreground",
  };

  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-md w-full">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.type as keyof typeof iconMap] || Info;

        return (
          <div
            key={notification.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border-2 shadow-neomorph",
              "animate-in slide-in-from-right duration-300",
              colorMap[notification.type as keyof typeof colorMap]
            )}
          >
            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
