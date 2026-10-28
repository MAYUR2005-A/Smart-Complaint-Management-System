
import { useState } from "react";
import { useAuth } from "@clerk/react";
import {
  FileText,
  MapPin,
  Upload,
  Send,
  X,
  AlertCircle,
  Image,
} from "lucide-react";
import { uploadToCloudinary } from "../../Utils/uploadToCloudinary";

const API = `${import.meta.env.VITE_API_URL}/api/complaints`;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const RaiseComplaint = () => {
  const { getToken, isSignedIn } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    priority: "Medium",
    description: "",
  });

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = [];

    for (const file of selectedFiles) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert(`${file.name}: Please select a JPG, PNG, or WebP image.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}: Image must be 5 MB or smaller.`);
        continue;
      }

      validFiles.push(file);
    }

    setFiles((prev) => {
      const combined = [...prev];

      for (const file of validFiles) {
        const duplicate = combined.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        );

        if (!duplicate) {
          combined.push(file);
        }
      }

      return combined;
    });

    e.target.value = "";
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      location: "",
      priority: "Medium",
      description: "",
    });

    setFiles([]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isSignedIn) {
      setError("Please sign in before submitting a complaint.");
      return;
    }

    try {
      setSubmitting(true);

      const token = await getToken();

      if (!token) {
        throw new Error(
          "Unable to get your authentication token. Please sign in again."
        );
      }

      const imageUrls = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );

      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          imageUrls,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to submit complaint."
        );
      }

      alert("Complaint submitted successfully!");
      resetForm();
    } catch (error) {
      console.error("Complaint submission error:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-sm text-slate-500">
            Resident / Raise Complaint
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Raise a Complaint
          </h1>

          <p className="mt-2 text-slate-500">
            Tell us about the issue and we will help get it resolved.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <FileText size={24} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Complaint Details
              </h2>

              <p className="text-sm text-slate-500">
                Fill in the information below.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Complaint Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Water leakage in bathroom"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select category</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Lift">Lift</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Security">Security</option>
                <option value="Noise">Noise</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <MapPin size={16} />
                Location *
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Building A, Flat 204"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Priority *
              </label>

              <div className="grid grid-cols-3 gap-3">
                {["Low", "Medium", "High"].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        priority,
                      }))
                    }
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      formData.priority === priority
                        ? priority === "High"
                          ? "border-red-500 bg-red-50 text-red-600"
                          : priority === "Medium"
                          ? "border-amber-500 bg-amber-50 text-amber-600"
                          : "border-green-500 bg-green-50 text-green-600"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the problem in detail..."
                rows={5}
                required
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Complaint Photos (Optional)
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-6 py-8 transition hover:border-blue-400 hover:bg-blue-50/50">
                <Upload size={28} className="mb-3 text-blue-500" />

                <span className="text-sm font-medium text-slate-700">
                  Click to upload complaint photos
                </span>

                <span className="mt-1 text-xs text-slate-400">
                  JPG, PNG or WebP · Maximum 5 MB per image
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={submitting}
                />
              </label>

              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Image
                          size={18}
                          className="shrink-0 text-blue-500"
                        />

                        <span className="truncate text-sm text-slate-600">
                          {file.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        disabled={submitting}
                        className="ml-3 text-slate-400 hover:text-red-500 disabled:opacity-50"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-6 py-3 font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !isSignedIn}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={17} />
              {submitting
                ? "Uploading photos and submitting..."
                : "Submit Complaint"}
            </button>
          </div>
        </form>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <p className="text-sm leading-6 text-blue-800">
            Please provide accurate details and clear photos so the
            society administrator can resolve your complaint efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RaiseComplaint;
