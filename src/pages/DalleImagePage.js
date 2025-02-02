import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import DalleLike from "../components/DalleLike";
import FullscreenImage from "../components/FullScreenImage";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function DalleImagePage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invalidImages, setInvalidImages] = useState(new Set());
  const user = auth.currentUser;
  const userId = user?.uid || null;
  const storage = getStorage(); // ✅ Initialize Firebase Storage once

  // Fetch images from Firestore
  useEffect(() => {
    const imagesRef = collection(db, "images");
    const q = query(imagesRef, orderBy("timestamp", "desc"));
  
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedImages = snapshot.docs.map((doc) => {
          let data = { id: doc.id, ...doc.data() };
          console.log("[DEBUG] Fetched Image Data:", data);
          return data;
        });
        setImages(fetchedImages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching images:", error);
        setLoading(false);
      }
    );
  
    return () => unsubscribe();
  }, []);
  // Handle image loading errors
  const handleImageError = (imageId) => {
    console.error(`Image failed to load: ${imageId}`);
    setInvalidImages((prevInvalidImages) => new Set([...prevInvalidImages, imageId]));
  };

  // Lazy loading image component (fetches image URL inside `useEffect`)
  const LazyImage = ({ src, alt, onError }) => {
    return (
      <div style={{ minHeight: "150px", backgroundColor: "#333" }}>
        <img
          src={src}
          alt={alt}
          className="h-38 w-full object-cover mb-1 cursor-pointer"
          onError={(e) => (e.target.src = "/fallback.png")} // ✅ Use fallback image if an error occurs
        />
      </div>
    );
  };
  if (loading) {
    return <div className="text-white text-center">Loading images...</div>;
  }

  if (images.length === 0) {
    return <div className="text-white text-center">No images found.</div>;
  }
  // Handle likes (placeholder logic)
  const handleLike = async (imageId) => {
    console.log(`Liked image ID: ${imageId}`);
    // Implement like logic if needed
  };
  return (
    <>
      <h2 className="text-white text-center">User Images</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 gap-4 overflow-y-auto">
      {images
  .filter((image) => 
    image.imageUrl && image.imageUrl.startsWith("http") && // ✅ Ensure image URL is valid
    image.prompt &&   // ✅ Ensure prompt exists
    image.displayName && // ✅ Ensure displayName exists
    image.timestamp   // ✅ Ensure timestamp exists
  )
  .map((image) => {
            const prompt = image.prompt || "No prompt available";
            const displayName = image.displayName || "Anonymous User";

            return (
              <div key={image.id} className="p-2 border border-gray-700 rounded-lg bg-gray-800">
                <Link to={`/image/${image.id}`}>
                <LazyImage src={image.imageUrl} alt={prompt} onError={() => handleImageError(image.id)} />
                </Link>
                <DalleLike
                  className="mt-2"
                  handleLike={() => handleLike(image.id)}
                  likes={image.likes || 0}
                  userId={userId}
                  imageId={image.id}
                />
                <p className="text-white text-sm italic mt-2 text-center">
                  {prompt}
                </p>
                <Link to={`/profile/${image.userId}`}>
                  <p className="text-white hover:bg-slate-700">{displayName}</p>
                </Link>
                <p className="text-white text-xs">
                  {image.timestamp?.toDate().toLocaleString() || "Unknown date"}
                </p>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default DalleImagePage;