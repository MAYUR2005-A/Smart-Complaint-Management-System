
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

function MyComplaints() {
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      if (!token) {
        setComplaints([]);
        setError("Please sign in to view your complaints.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load complaints."
        );
      }

      setComplaints(data.complaints || []);
    } catch (err) {
      console.error("Fetch complaints error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchComplaints();
    } else {
      setComplaints([]);
      setLoading(false);
    }
  }, [isSignedIn]);

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (complaint.title || "").toLowerCase().includes(searchText) ||
      (complaint.category || "").toLowerCase().includes(searchText) ||
      (complaint.location || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatComplaintId = (id) => {
    return id ? `CMP-${id.slice(-6).toUpperCase()}` : "N/A";
  };

  const pendingCount = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const inProgressCount = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Complaints
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Track and manage your submitted complaints.
            </p>
          </div>

          <button
            onClick={() => navigate("/resident/raisecomplaint")}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={20} />
            Raise Complaint
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-3">
                <Clock className="text-yellow-600" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {pendingCount}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <RefreshCw className="text-blue-600" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {inProgressCount}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3">
                <CheckCircle className="text-green-600" size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resolved</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {resolvedCount}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category, or location..."
              className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <button
            onClick={fetchComplaints}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Could not load complaints</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
            <RefreshCw className="mx-auto animate-spin text-blue-600" size={32} />
            <p className="mt-4 text-gray-500">Loading your complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
            <FileText className="mx-auto text-gray-300" size={48} />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              {complaints.length === 0
                ? "No complaints yet"
                : "No matching complaints"}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {complaints.length === 0
                ? "Your submitted complaints will appear here."
                : "Try changing your search or status filter."}
            </p>

            {complaints.length === 0 && (
              <button
                onClick={() => navigate("/resident/raisecomplaint")}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Raise Your First Complaint
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex gap-4">
                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 sm:flex">
                      <FileText className="text-blue-600" size={24} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        {formatComplaintId(complaint._id)}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-gray-900">
                        {complaint.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {complaint.category}
                        {complaint.location
                          ? ` • ${complaint.location}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                      complaint.status
                    )}`}
                  >
                    {complaint.status || "Pending"}
                  </span>
                </div>

                {complaint.description && (
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {complaint.description}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(
                      complaint.priority
                    )}`}
                  >
                    {complaint.priority || "Medium"} Priority
                  </span>

                  <span className="text-sm text-gray-500">
                    Submitted: {formatDate(complaint.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyComplaints;
