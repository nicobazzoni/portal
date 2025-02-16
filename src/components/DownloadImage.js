import React from "react";
import { DownloadOutlined } from "@ant-design/icons";

const generateFirebaseUrl = (path) => {
  if (path.startsWith("http")) {
    return path; // ✅ Prevents double-encoding issue
  }

  const bucketName = "mediaman-a8ba1.appspot.com";
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media`;
};

const DownloadImage = ({ imagePath, fileName = "image.png" }) => {
  const handleDownload = async () => {
    try {
      const imageUrl = generateFirebaseUrl(imagePath);
      console.log("Downloading image from:", imageUrl);

      const response = await fetch(imageUrl, { mode: "cors" });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const blob = await response.blob();
      if (!blob.type.startsWith("image/")) {
        throw new Error("Invalid file type received. Ensure Firebase is serving the correct file.");
      }

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("❌ Error downloading image:", error.message);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="p-2 border-none  bg-transparent  flex items-center"
    >
       <DownloadOutlined />
    </button>
  );
};

export default DownloadImage;