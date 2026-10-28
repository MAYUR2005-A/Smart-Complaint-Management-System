const CLOUD_NAME = "sowvug0l";
const UPLOAD_PRESET = "complaint_images";

export async function uploadToCloudinary(file) {
  if (!file) return "";

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be smaller than 5 MB.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Image upload failed.");
  }

  return data.secure_url;
}