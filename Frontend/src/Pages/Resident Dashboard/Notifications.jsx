import React, { useState, useEffect, useCallback } from "react";
import { Bell, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { useAuth } from "@clerk/react";

const API = "http://localhost:5000/api/complaints";

const Notifications = () => {
  const { getToken, isSignedIn } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readingId, setReadingId] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isSignedIn) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setError("");

      const token = await getToken();

      const response = await fetch(`${API}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load notifications."
        );
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      setReadingId(id);
      setError("");

      const token = await getToken();

      const response = await fetch(
        `${API}/resident/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to mark notification as read."
        );
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setReadingId(null);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="min-h-screen w-full bg-slate-50 p-6 md:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Notifications
          </h1>
          <p className="mt-1 text-slate-500">
            Stay updated on your complaint activity.
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          disabled={!isSignedIn || loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 hover:bg-slate-100 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-3">
          <Bell className="text-blue-600" size={22} />

          <h2 className="text-lg font-bold text-slate-900">
            Recent Activity
          </h2>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
            {notifications.length}
          </span>

          <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
            {unreadCount} unread
          </span>
        </div>

        {loading ? (
          <p className="py-10 text-center text-slate-500">
            Loading notifications...
          </p>
        ) : !isSignedIn ? (
          <p className="py-10 text-center text-slate-500">
            Please sign in to view your notifications.
          </p>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell
              size={38}
              className="mx-auto mb-3 text-slate-300"
            />
            <p className="font-medium text-slate-700">
              No notifications yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Updates will appear here when you register a complaint
              or its status changes.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => {
              const registered =
                notification.type === "registered";

              return (
                <div
                  key={notification._id}
                  className={`flex gap-4 py-5 ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      registered
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {registered ? (
                      <CheckCircle size={21} />
                    ) : (
                      <Clock size={21} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800">
                      {notification.message}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {notification.createdAt
                        ? new Date(
                            notification.createdAt
                          ).toLocaleString()
                        : ""}
                    </p>

                    {!notification.read && (
                      <button
                        onClick={() =>
                          markAsRead(notification._id)
                        }
                        disabled={readingId === notification._id}
                        className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        {readingId === notification._id
                          ? "Marking as read..."
                          : "Mark as read"}
                      </button>
                    )}
                  </div>

                  {!notification.read && (
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
