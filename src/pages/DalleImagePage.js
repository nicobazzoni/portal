import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import DalleLike from "../components/DalleLike";

function DalleImagePage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invalidImages, setInvalidImages] = useState(new Set()); // Track invalid images
  const user = auth.currentUser;
  const userId = user?.uid || null;

  // Real-time Firestore listener
  useEffect(() => {
    const imagesRef = collection(db, "images");

    const q = query(imagesRef, orderBy("timestamp", "desc")); // Adjust the field to match Firestore
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedImages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched Images: ", fetchedImages);

        setImages(fetchedImages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching images: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Clean up the listener
  }, []);

  const handleImageError = (imageId) => {
    console.warn(`Image failed to load for post with ID: ${imageId}`);
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

    const handleImageClick = () => {
      if (imgRef.current) {
        if (imgRef.current.requestFullscreen) {
          imgRef.current.requestFullscreen();
        } else if (imgRef.current.webkitRequestFullscreen) {
          imgRef.current.webkitRequestFullscreen(); // Safari
        } else if (imgRef.current.mozRequestFullScreen) {
          imgRef.current.mozRequestFullScreen(); // Firefox
        } else if (imgRef.current.msRequestFullscreen) {
          imgRef.current.msRequestFullscreen(); // IE/Edge
        } else {
          console.warn("Fullscreen API is not supported by this browser.");
        }
      }
    };

    return (
      <div ref={imgRef} style={{ minHeight: "150px", backgroundColor: "#333" }}>
        {isVisible && (
          <img
            src={src}
            alt={alt}
            onError={onError}
            className="h-38 w-full object-cover mb-1 cursor-pointer"
            onClick={handleImageClick}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-4 overflow-y-auto">
        {images
          .filter((image) => !invalidImages.has(image.id)) // Exclude invalid images
          .map((image) => (
            <div key={image.id} className="p-2 border border-gray-700 rounded-lg bg-gray-800">
              <LazyImage
                src={image.imageUrl}
                alt={image.prompt || "Generated image"}
                onError={() => handleImageError(image.id)}
              />
              <DalleLike
                handleLike={() => handleLike(image.id)}
                likes={image.likes || 0}
                userId={userId}
                imageId={image.id}
              />
              <p className="text-white text-sm italic mt-2 text-center">
                {image.prompt || "No prompt available"}
              </p>
              <Link to={`/profile/${image.userId}`} className="no-underline">
                <p className="text-white hover:bg-slate-700">
                  {image.displayName || "Anonymous User"}
                </p>
              </Link>
              <p className="text-white text-xs">
                {image.timestamp?.toDate().toLocaleString() || "Unknown date"}
              </p>
            </div>
          ))}
      </div>
    </>
  );
}

export default DalleImagePage;