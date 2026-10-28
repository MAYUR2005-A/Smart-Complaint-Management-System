
import React, { useCallback, useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  Clock3,
  Info,
  Trash2,
  RefreshCw,
  Check,
} from "lucide-react";
import { useAuth } from "@clerk/react";

const API = `${import.meta.env.VITE_API_URL}/api/complaints`;

const Notifications = () => {
  const { getToken, isSignedIn } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const fetchNotifications = useCallback(async () => {
    if (!isSignedIn) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(`${API}/admin/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load notifications.");
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
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const formatTime = (date) => {
    if (!date) return "";

    const difference = Date.now() - new Date(date).getTime();

    if (!Number.isFinite(difference) || difference < 0) {
      return "Just now";
    }

    const minutes = Math.floor(difference / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);

    if (days < 7) return `${days} days ago`;

    return new Date(date).toLocaleDateString();
  };

  const getNotificationStyle = (notification) => {
    if (notification.type === "status_update") {
      if (notification.message?.toLowerCase().includes("resolved")) {
        return {
          Icon: CheckCircle,
          iconStyle: "bg-green-100 text-green-600",
        };
      }

      return {
        Icon: Clock3,
        iconStyle: "bg-yellow-100 text-yellow-600",
      };
    }

    return {
      Icon: Info,
      iconStyle: "bg-blue-100 text-blue-600",
    };
  };

  const markAsRead = async (id) => {
    try {
      setActionId(id);
      setError("");

      const token = await getToken();

      const response = await fetch(`${API}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not mark as read.");
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
      setActionId("");
    }
  };

  const markAllAsRead = async () => {
    try {
      setActionId("all");
      setError("");

      const token = await getToken();

      const response = await fetch(`${API}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not mark all as read.");
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setActionId("");
    }
  };

  const deleteNotification = async (id) => {
    try {
      setActionId(id);
      setError("");

      const token = await getToken();

      const response = await fetch(`${API}/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete notification.");
      }

      setNotifications((previous) =>
        previous.filter((notification) => notification._id !== id)
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 sm:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Notifications
          </h1>

          <p className="mt-1 text-slate-500">
            Stay updated with complaints and resident activity.
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Notifications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {notifications.length} notifications · {unreadCount} unread
            </p>
          </div>

          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0 || actionId !== ""}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check size={16} />
            Mark all as read
          </button>
        </div>

        {error && (
          <div className="m-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="mx-auto mb-3 text-slate-300" size={36} />
            <h3 className="font-semibold text-slate-700">
              No notifications yet
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              New complaint activity will appear here.
            </p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => {
              const { Icon, iconStyle } =
                getNotificationStyle(notification);

              return (
                <div
                  key={notification._id}
                  className={`flex items-start gap-4 border-b border-slate-100 p-5 transition hover:bg-slate-50 ${
                    !notification.read ? "bg-blue-50/40" : ""
                  }`}
                >
                  <div className={`rounded-full p-3 ${iconStyle}`}>
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {notification.type === "registered"
                          ? "New complaint submitted"
                          : "Complaint status updated"}
                      </h3>

                      {!notification.read && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-1 break-words text-sm text-slate-600">
                      {notification.residentName || "Resident"}:{" "}
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {!notification.read && (
                      <button
                        title="Mark as read"
                        aria-label="Mark notification as read"
                        disabled={actionId !== ""}
                        onClick={() => markAsRead(notification._id)}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-40"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}

                    <button
                      title="Delete notification"
                      aria-label="Delete notification"
                      disabled={actionId !== ""}
                      onClick={() => deleteNotification(notification._id)}
                      className="text-slate-400 hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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
