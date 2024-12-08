// /Users/nico/Desktop/apps/portal/src/pages/DalleImagePage.js

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import DalleLike from "../components/DalleLike";
import FullscreenImage from "../components/FullScreenImage.js";

function DalleImagePage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invalidImages, setInvalidImages] = useState(new Set());
  const user = auth.currentUser;
  const userId = user?.uid || null;

  // Real-time Firestore listener
  useEffect(() => {
    const imagesRef = collection(db, "images");
    const q = query(imagesRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedImages = snapshot.docs.map((doc) => {
          const data = { id: doc.id, ...doc.data() };
          console.log("Fetched Image:", data); // Add this line for debugging
          return data;
        });
        setImages(fetchedImages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching images: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleImageError = (imageId) => {
    setInvalidImages((prevInvalidImages) => new Set([...prevInvalidImages, imageId]));
  };

  const handleLike = async (imageId) => {
    console.log(`Liked image ID: ${imageId}`);
    // Placeholder for like logic
  };

  const LazyImage = ({ src, alt, onError }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = React.useRef();

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (imgRef.current) observer.observe(imgRef.current);

      return () => observer.disconnect();
    }, []);

    return (
      <div ref={imgRef} style={{ minHeight: "150px", backgroundColor: "#333" }}>
        {isVisible && (
          <FullscreenImage
            src={src}
            alt={alt}
            onError={onError}
            className="h-38 w-full object-cover mb-1 cursor-pointer"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="text-white text-center">Loading images...</div>;
  }

  if (images.length === 0) {
    return <div className="text-white text-center">No images found.</div>;
  }

  return (
    <>
      <h2 className="text-white text-center">User Images</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 gap-4 overflow-y-auto">
        {images
          .filter((image) => !invalidImages.has(image.id))
          .map((image) => {
            // Sanitize fields
            const prompt = typeof image.prompt === "string" ? image.prompt : "No prompt available";
            const displayName = typeof image.displayName === "string" ? image.displayName : "Anonymous User";
            const imageUrl = typeof image.imageUrl === "string" ? image.imageUrl : "https://via.placeholder.com/300";

            return (
              <div key={image.id} className="p-2 border border-gray-700 rounded-lg bg-gray-800">
                <Link to={`/image/${image.id}`}>
                  <LazyImage
                    src={imageUrl}
                    alt={prompt}
                    onError={() => handleImageError(image.id)}
                  />
                </Link>
                <DalleLike
                  className="mt-2"
                  handleLike={() => handleLike(image.id)}
                  likes={typeof image.likes === "number" ? image.likes : 0}
                  userId={userId}
                  imageId={image.id}
                />
                <p className="text-white text-sm italic mt-2 text-center">
                  {prompt}
                </p>
                <Link to={`/profile/${image.userId}`}>
                  <p className="text-white hover:bg-slate-700">
                    {displayName}
                  </p>
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