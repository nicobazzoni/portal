import React, { useState, useEffect, useMemo } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { Link } from "react-router-dom";
import Spinner from "./Spinner"; // Assuming you have a Spinner component
import FullscreenImage from "../components/FullScreenImage.js";

function DynamicMoodCarousel() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleImages, setVisibleImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const DISPLAY_COUNT = 4; // Number of images to display at a time
  const INTERVAL_MS = 5000; // Interval in milliseconds for image changes

  useEffect(() => {
    const imagesRef = collection(db, "images");
    const q = query(imagesRef, orderBy("timestamp", "desc"), limit(12)); // Fetch 12 latest images
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedImages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(fetchedImages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching images: ", error);
        setLoading(false); // Ensure loading state is updated on error
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      // Start the carousel
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + DISPLAY_COUNT) % images.length);
      }, INTERVAL_MS);
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [images]);

  // Memoized valid images to filter out invalid ones
  const validImages = useMemo(
    () => images.filter((image) => image.imageUrl && image.imageUrl.trim() !== ""),
    [images]
  );

  useEffect(() => {
    // Update the visible images whenever the currentIndex changes
    if (validImages.length > 0) {
      const newVisibleImages = [];
      for (let i = 0; i < DISPLAY_COUNT; i++) {
        const index = (currentIndex + i) % validImages.length;
        newVisibleImages.push(validImages[index]);
      }
      setVisibleImages(newVisibleImages);
    }
  }, [currentIndex, validImages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner /> {/* Display Spinner while loading */}
      </div>
    );
  }

  if (validImages.length === 0) {
    return <div className="text-white text-center mt-4">No images available.</div>;
  }

  return (
    <div className="mood-carousel-container">
      <h2 className="text-white text-center mb-4 text-lg font-semibold">Dalle AI Images</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 p-4">
        {visibleImages.map((image) => (
          <div
            key={image.id}
            className="p-2 border border-gray-700 rounded-lg bg-gray-800 animate-slide-in"
          >
            <FullscreenImage
              src={image.imageUrl}
              alt="Mood"
              className="w-full h-48 object-cover rounded-lg"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none"; // Hide the image if it fails to load
              }}
            />
            <Link to={`/profile/${image.userId}`} className="no-underline">
              <p className="text-white mt-2 text-center">
                {image.displayName || "Anonymous User"}
              </p>
            </Link>
            <p className="text-white text-xs text-center">
              {image.timestamp?.toDate().toLocaleString() || "Unknown date"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DynamicMoodCarousel;