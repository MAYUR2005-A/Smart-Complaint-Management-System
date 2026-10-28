
import React, { useEffect, useState, useCallback } from "react";
import { Search, RefreshCw, X, Eye } from "lucide-react";
import { useAuth } from "@clerk/react";

const API = `${import.meta.env.VITE_API_URL}/api/complaints`;

const Complaints = () => {
  const { getToken } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(`${API}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load complaints.");
      }

      setComplaints(data.complaints || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const token = await getToken();

      const response = await fetch(`${API}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status.");
      }

      await fetchComplaints();
    } catch (err) {
      setError(err.message || "Failed to update complaint status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch = [
      complaint.title,
      complaint.category,
      complaint.location,
      complaint.userId,
      complaint.residentName,
      complaint.description,
      complaint.complaintCode,
    ].some((value) =>
      String(value || "").toLowerCase().includes(searchText)
    );

    const matchesStatus =
      filter === "All Status" || complaint.status === filter;

    return matchesSearch && matchesStatus;
  });

  const statusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getComplaintCode = (complaint) =>
    complaint.complaintCode ||
    `CMP-${String(complaint._id || "").slice(-6).toUpperCase()}`;

  const closeGallery = () => {
    setSelectedComplaint(null);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complaints</h1>
        <p className="mt-2 text-gray-500">
          Manage and track all complaints submitted by residents.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search complaints..."
            className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <button
            type="button"
            onClick={fetchComplaints}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            <X size={18} />
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">All Complaints</h2>
          <span className="text-sm text-gray-500">
            {filteredComplaints.length} complaints
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No complaints found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">Complaint</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Resident Name</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Images</th>
                  <th className="px-5 py-4 font-semibold">Update Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredComplaints.map((complaint) => {
                  const imageUrls = Array.isArray(complaint.imageUrls)
                    ? complaint.imageUrls
                    : [];

                  return (
                    <tr key={complaint._id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-5 py-5 text-sm font-medium text-gray-700">
                        {getComplaintCode(complaint)}
                      </td>

                      <td className="max-w-[230px] px-5 py-5">
                        <p className="font-medium text-gray-900">
                          {complaint.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {complaint.location}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-700">
                        {complaint.category}
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-700">
                        {complaint.residentName || "Resident"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-sm text-gray-600">
                        {formatDate(complaint.createdAt)}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        {imageUrls.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setSelectedImage(null);
                            }}
                            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-700 transition hover:bg-blue-50"
                          >
                            <Eye size={17} />
                            View ({imageUrls.length})
                          </button>
                        ) : (
                          <span className="whitespace-nowrap text-sm text-gray-400">
                            No images
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-5">
                        <select
                          value={complaint.status}
                          disabled={updatingId === complaint._id}
                          onChange={(event) =>
                            updateStatus(complaint._id, event.target.value)
                          }
                          className="rounded-lg cursor-pointer border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-50"
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>

                        {updatingId === complaint._id && (
                          <span className="ml-2 text-xs text-gray-400">
                            Updating...
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeGallery}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Complaint Images
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedComplaint.title}
                </p>
              </div>

              <button
                type="button"
                onClick={closeGallery}
                className="cursor-pointer rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                &times;
              </button>
            </div>

            <div className="flex w-full flex-wrap items-center justify-center gap-6">
              {(selectedComplaint.imageUrls || []).map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="flex w-60 shrink-0 flex-col items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-center bg-gray-100"
                    onClick={() => setSelectedImage(url)}
                  >
                    <img
                      src={url}
                      alt={`Complaint ${index + 1}`}
                      className="h-48 w-full cursor-pointer object-contain"
                    />
                  </button>

                  <div className="w-full border-t border-gray-200 px-3 py-3 text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Image {index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedImage(url)}
                      className="mt-2 cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      View Full Image
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {(!selectedComplaint.imageUrls ||
              selectedComplaint.imageUrls.length === 0) && (
              <div className="flex min-h-40 w-full items-center justify-center text-center text-gray-500">
                No images attached to this complaint.
              </div>
            )}
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Close full image"
          >
            <X size={28} className="cursor-pointer" />
          </button>

          <img
            src={selectedImage}
            alt="Full complaint"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Complaints;
