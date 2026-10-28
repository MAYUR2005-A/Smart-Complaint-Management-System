
import React, { useState, useEffect, useCallback } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { useAuth } from "@clerk/react";

const API = `${import.meta.env.VITE_API_URL}/api/complaints`;

const NotificationBell = () => {
  const { getToken, isSignedIn } = useAuth();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiRequest = useCallback(
    async (endpoint, options = {}) => {
      const token = await getToken();

      const response = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed (${response.status})`
        );
      }

      return data;
    },
    [getToken]
  );

  const fetchNotifications = useCallback(async () => {
    if (!isSignedIn) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/notifications");

      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message || "Failed to load notifications.");
      console.error("Notification error:", err);
    } finally {
      setLoading(false);
    }
  }, [apiRequest, isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) {
      setNotifications([]);
      return;
    }

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [isSignedIn, fetchNotifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = async (id) => {
    try {
      await apiRequest(`/resident/notifications/${id}/read`, {
        method: "PATCH",
      });

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      setError(err.message || "Failed to mark notification as read.");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (notification) => !notification.read
      );

      await Promise.all(
        unreadNotifications.map((notification) =>
          apiRequest(
            `/resident/notifications/${notification._id}/read`,
            { method: "PATCH" }
          )
        )
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      setError(err.message || "Failed to mark notifications as read.");
      fetchNotifications();
    }
  };

  if (!isSignedIn) return null;

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((previous) => !previous);
          if (!open) fetchNotifications();
        }}
        className="relative rounded-full p-2 transition hover:bg-gray-100"
        aria-label="Notifications"
      >
        <Bell size={23} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h3 className="font-semibold text-gray-800">
                Notifications
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {unreadCount} unread · {notifications.length} total
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
              >
                <CheckCheck size={19} />
              </button>
            )}
          </div>

          {error && (
            <p className="border-b bg-red-50 p-3 text-xs text-red-700">
              {error}
            </p>
          )}

          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-500">
                Loading notifications...
              </p>
            ) : notifications.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-500">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`flex gap-3 border-b p-4 ${
                    notification.read ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {notification.message}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {notification.createdAt
                        ? new Date(
                            notification.createdAt
                          ).toLocaleString()
                        : ""}
                    </p>

                    {!notification.read && (
                      <span className="mt-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        New
                      </span>
                    )}
                  </button>

                  <div className="flex shrink-0 items-start gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        title="Mark as read"
                        className="text-green-600 hover:text-green-800"
                      >
                        <Check size={17} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t p-3 text-center">
            <button
              onClick={fetchNotifications}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Refresh notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
