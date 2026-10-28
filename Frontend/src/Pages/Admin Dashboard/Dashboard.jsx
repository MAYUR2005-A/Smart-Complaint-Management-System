
import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowUpRight,
  Bell,
  CheckCircle,
  Clock3,
  FileText,
  Info,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

const API = `${import.meta.env.VITE_API_URL}/api/complaints`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = useCallback(async () => {
    if (!isSignedIn) {
      setComplaints([]);
      setLoading(false);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const token = await getToken();

      const response = await fetch(`${API}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch complaints.");
      }

      setComplaints(data.complaints || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const total = complaints.length;

  const pending = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const categoryCounts = complaints.reduce((counts, complaint) => {
    const category = complaint.category || "Other";
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

  const categories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCategoryCount = Math.max(
    ...categories.map(([, count]) => count),
    1
  );

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const stats = [
    {
      title: "Total Complaints",
      count: total,
      icon: FileText,
      iconStyle: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending",
      count: pending,
      icon: Clock3,
      iconStyle: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "In Progress",
      count: inProgress,
      icon: ArrowUpRight,
      iconStyle: "bg-blue-100 text-blue-600",
    },
    {
      title: "Resolved",
      count: resolved,
      icon: CheckCircle,
      iconStyle: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome, Admin!
          </h1>

          <p className="mt-1 text-slate-500">
            Here's an overview of the complaint management system.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchComplaints}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={fetchComplaints}
            className="mt-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isSignedIn && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Please sign in to view dashboard data.
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className={`rounded-full p-3 ${stat.iconStyle}`}>
                <Icon size={23} />
              </div>

              <div>
                <p className="text-sm text-slate-500">{stat.title}</p>
                <h2 className="text-3xl font-bold text-slate-900">
                  {loading ? "—" : stat.count}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-6 text-lg font-bold text-slate-900">
            Complaints by Category
          </h2>

          {loading ? (
            <p className="py-16 text-center text-slate-400">
              Loading categories...
            </p>
          ) : categories.length === 0 ? (
            <p className="py-16 text-center text-slate-400">
              No complaints available yet.
            </p>
          ) : (
            <div className="flex min-h-64 items-end justify-around gap-3 overflow-x-auto pt-4">
              {categories.map(([category, count]) => (
                <div
                  key={category}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2"
                >
                  <span className="text-sm font-semibold text-slate-700">
                    {count}
                  </span>

                  <div
                    className="w-full max-w-12 rounded-t-md bg-blue-500"
                    style={{
                      height: `${Math.max(
                        (count / maxCategoryCount) * 150,
                        12
                      )}px`,
                    }}
                  />

                  <span className="max-w-full break-words text-center text-xs text-slate-500">
                    {category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate("/admin/complaints")}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
            >
              <FileText size={20} />
              View All Complaints
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/notifications")}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 py-3 text-slate-700 hover:bg-slate-50"
            >
              <Bell size={20} />
              View Notifications
            </button>
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Resolution rate</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {total === 0 ? 0 : Math.round((resolved / total) * 100)}%
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Percentage of complaints marked as resolved.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Complaints
            </h2>

            <button
              type="button"
              onClick={() => navigate("/admin/complaints")}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              View All <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-3 pr-4">Title</th>
                  <th className="pr-4">Category</th>
                  <th className="pr-4">Resident</th>
                  <th className="pr-4">Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-slate-400"
                    >
                      Loading complaints...
                    </td>
                  </tr>
                ) : recentComplaints.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-slate-400"
                    >
                      No complaints found.
                    </td>
                  </tr>
                ) : (
                  recentComplaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="border-b last:border-0"
                    >
                      <td className="max-w-48 py-4 pr-4 font-medium text-slate-800">
                        {complaint.title}
                      </td>

                      <td className="pr-4 text-slate-600">
                        {complaint.category}
                      </td>

                      <td className="pr-4 text-slate-600">
                        {complaint.residentName || "Unknown Resident"}
                      </td>

                      <td className="whitespace-nowrap pr-4 text-slate-500">
                        {formatDate(complaint.createdAt)}
                      </td>

                      <td>
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${getStatusStyle(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-5 flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h2>

            <button
              type="button"
              onClick={() => navigate("/admin/notifications")}
              className="whitespace-nowrap text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>

          <div className="space-y-5">
            {loading ? (
              <p className="py-8 text-center text-slate-400">
                Loading activity...
              </p>
            ) : recentComplaints.length === 0 ? (
              <p className="py-8 text-center text-slate-400">
                No recent activity.
              </p>
            ) : (
              recentComplaints.slice(0, 4).map((complaint) => (
                <div key={complaint._id} className="flex gap-3">
                  <div className="h-fit rounded-full bg-blue-100 p-2">
                    {complaint.status === "Resolved" ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : complaint.status === "In Progress" ? (
                      <Clock3 className="text-blue-600" size={20} />
                    ) : (
                      <Info className="text-blue-600" size={20} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-slate-800">
                      {complaint.status === "Resolved"
                        ? "Complaint resolved"
                        : complaint.status === "In Progress"
                        ? "Complaint in progress"
                        : "Complaint registered"}
                    </p>

                    <p className="break-words text-sm text-slate-500">
                      {complaint.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(complaint.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="mt-5 border-t border-slate-100 pt-3 text-xs text-slate-400">
            Activity is based on recent complaint records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
