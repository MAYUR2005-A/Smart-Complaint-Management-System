
import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircle,
  Clock3,
  FileText,
  Plus,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

const API = `${import.meta.env.VITE_API_URL?.replace(/\/+$/, "")}/api/complaints`;

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
      setLoading(true);
      setError("");

      if (!import.meta.env.VITE_API_URL) {
        throw new Error("VITE_API_URL is missing. Check your Vercel environment variables.");
      }

      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      const response = await fetch(API, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "The server returned an invalid response. Check your backend URL."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to load complaints.");
      }

      if (data.success === false) {
        throw new Error(data.message || "Failed to load complaints.");
      }

      setComplaints(
        Array.isArray(data)
          ? data
          : Array.isArray(data.complaints)
            ? data.complaints
            : Array.isArray(data.data)
              ? data.data
              : []
      );
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const pendingCount = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-600";
      case "Resolved":
        return "bg-green-100 text-green-600";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, Resident!
        </h1>

        <p className="mt-1 text-slate-500">
          Track your complaints and stay updated with the latest status.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <FileText className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">My Complaints</p>
              <h2 className="text-3xl font-bold text-slate-900">
                {loading ? "..." : complaints.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock3 className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-700">In Progress</p>
              <h2 className="text-3xl font-bold text-slate-900">
                {loading ? "..." : inProgressCount}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Resolved</p>
              <h2 className="text-3xl font-bold text-slate-900">
                {loading ? "..." : resolvedCount}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            onClick={fetchComplaints}
            className="ml-3 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Complaints
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your recently submitted complaints
              </p>
            </div>

            <button
              onClick={() => navigate("/resident/mycomplaint")}
              className="flex shrink-0 cursor-pointer items-center gap-1 text-sm text-blue-600"
            >
              View All
              <ArrowUpRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">
              <RefreshCw className="mx-auto animate-spin" size={25} />
              <p className="mt-3">Loading complaints...</p>
            </div>
          ) : error ? (
            <p className="py-8 text-center text-slate-500">
              Unable to load complaints. Please try again.
            </p>
          ) : recentComplaints.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto text-slate-300" size={40} />
              <p className="mt-3 font-medium text-slate-700">
                No complaints yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Your submitted complaints will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 p-3">ID</th>
                    <th className="border border-slate-200 p-3">Complaint</th>
                    <th className="border border-slate-200 p-3">Category</th>
                    <th className="border border-slate-200 p-3">Date</th>
                    <th className="border border-slate-200 p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentComplaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap border border-slate-200 p-3">
                        {complaint._id
                          ? `CMP-${complaint._id.slice(-6).toUpperCase()}`
                          : "N/A"}
                      </td>
                      <td className="border border-slate-200 p-3 font-medium text-slate-800">
                        {complaint.title || "Untitled"}
                      </td>
                      <td className="border border-slate-200 p-3">
                        {complaint.category || "N/A"}
                      </td>
                      <td className="whitespace-nowrap border border-slate-200 p-3">
                        {formatDate(complaint.createdAt)}
                      </td>
                      <td className="border border-slate-200 p-3">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${getStatusStyle(
                            complaint.status
                          )}`}
                        >
                          {complaint.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <button
            onClick={() => navigate("/resident/raisecomplaint")}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
          >
            <Plus size={20} />
            Raise Complaint
          </button>

          <button
            onClick={() => navigate("/resident/mycomplaint")}
            className="mt-3 w-full cursor-pointer rounded-lg border border-slate-300 py-3 text-slate-700 hover:bg-slate-50"
          >
            View My Complaints
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
