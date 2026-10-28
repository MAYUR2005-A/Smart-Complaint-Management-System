
import React, { useState, useEffect, useCallback } from "react";
import { Bell, X, Check } from "lucide-react";
import { useAuth } from "@clerk/react";

const API = `${import.meta.env.VITE_API_URL}/api/complaints`;

const NotificationBell = () => {
  const { getToken, isSignedIn } = useAuth();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    if (!isSignedIn) {
      setNotifications([]);
      return;
    }

    try {
      const token = await getToken();

      const response = await fetch(`${API}/admin/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications (${response.status})`);
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Notification error:", error);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) return;

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [fetchNotifications, isSignedIn]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = async (id) => {
    try {
      const token = await getToken();

      const response = await fetch(`${API}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await getToken();

      const response = await fetch(`${API}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  const removeNotification = async (id) => {
    try {
      const token = await getToken();

      const response = await fetch(`${API}/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((previous) =>
        previous.filter((notification) => notification._id !== id)
      );
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    const elapsed = Math.max(
      0,
      Date.now() - new Date(date).getTime()
    );

    const minutes = Math.floor(elapsed / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  };

  if (!isSignedIn) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((previous) => !previous)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        aria-label={`${unreadCount} unread notifications`}
      >
        <Bell size={24} className="text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="flex justify-between items-center p-4 border-b">
            <div>
              <h2 className="font-semibold text-gray-800">
                Notifications
              </h2>
              <p className="text-xs text-gray-500">
                {unreadCount} unread notifications
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification._id);
                    }
                  }}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="pt-1">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        removeNotification(notification._id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Delete notification"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.some((notification) => !notification.read) && (
            <div className="p-3 border-t">
              <button
                onClick={markAllAsRead}
                className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Check size={16} />
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
