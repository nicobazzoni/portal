import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import Spinner from "./Spinner"; // Assuming you have a Spinner component
import FullscreenImage from "../components/FullScreenImage.js";

function DynamicMoodCarousel() {
  const [images, setImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);
  const [loading, setLoading] = useState(true); // State for tracking loading

  useEffect(() => {
    const imagesRef = collection(db, "images");
    const q = query(imagesRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedImages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(fetchedImages);
        setLoading(false); // Set loading to false when data is fetched
      },
      (error) => {
        console.error("Error fetching images: ", error);
        setLoading(false); // Ensure loading is false on error
      }
    );
    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const getRandomImages = (imageArray) => {
    const validImages = imageArray.filter(
      (image) => image.imageUrl && image.imageUrl.trim() !== ""
    ); // Filter out invalid or empty image URLs
    const shuffled = [...validImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5); // Show 5 random images at a time
  };

  useEffect(() => {
    // Update visible images every 5 seconds
    const interval = setInterval(() => {
      setVisibleImages(getRandomImages(images));
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner /> {/* Display Spinner while loading */}
      </div>
    );
  }

  if (visibleImages.length === 0) {
    return (
      <div className="text-white text-center mt-4">
    <Spinner /> 
      </div>
    );
  }

  return (
    <div className="mood-carousel-container">
      <h2 className="text-white text-xs text-center mb-4">Dalle AI Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden">
        {visibleImages.map((image) => (
          <div
            key={image.id}
            className="p-2 border border-gray-700 rounded-lg bg-gray-800 animate-slide-in"
          >
            <FullscreenImage
              src={image.imageUrl}
              alt="Mood"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = "none"; // Hide the image if it fails to load
              }}
            />
            <Link to={`/profile/${image.userId}`} className="no-underline">
              <p className="text-white">{image.displayName || "Anonymous User"}</p>
            </Link>
            <p className="text-white text-xs">
              {image.timestamp?.toDate().toLocaleString() || "Unknown date"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DynamicMoodCarousel;