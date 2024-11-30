import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import DalleLike from "../components/DalleLike";

function DalleImagePage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invalidImages, setInvalidImages] = useState(new Set()); // Track invalid images
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  console.log(user);

  // Fetch images from Firestore
  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'images'), orderBy('uploadedAt', 'desc'))
      );

      const fetchedImages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched Images:", fetchedImages); // Debug fetched images

      setImages(fetchedImages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []); // Fetch images only once

  const handleLike = async (imageId) => {
    // Like logic goes here
  };

  const handleImageClick = (e) => {
    const image = e.target;
    if (image.requestFullscreen) {
      image.requestFullscreen();
    } else if (image.mozRequestFullScreen) {
      image.mozRequestFullScreen();
    } else if (image.webkitRequestFullscreen) {
      image.webkitRequestFullscreen();
    } else if (image.msRequestFullscreen) {
      image.msRequestFullscreen();
    }
  };

  const handleImageError = (imageId) => {
    console.warn(`Image failed to load for post with ID: ${imageId}`);
    setInvalidImages((prevInvalidImages) => new Set(prevInvalidImages).add(imageId));
  };

  if (loading) {
    return <div className="text-white text-center">Loading images...</div>;
  }

  return (
    <>
      <h2 className="text-white text-center">User Dalle AI Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-4 overflow-y-auto">
        {images
          .filter((image) => !invalidImages.has(image.id)) // Exclude invalid images
          .map((image) => (
            <div key={image.id} className="p-2 border border-gray-700 rounded-lg bg-gray-800">
              <img
                className="h-38 w-full object-cover mb-1 cursor-pointer"
                src={image.imageUrl}
                alt={image.prompt || "Generated image"}
                onClick={handleImageClick}
                onError={() => handleImageError(image.id)} // Handle image load error
              />
              <DalleLike
                handleLike={handleLike}
                likes={image.likes}
                userId={userId}
                imageId={image.id}
                className="mt-1 cursor-pointer"
              />
              <p className="text-white text-sm italic mt-2 text-center">
                {image.prompt || "No prompt available"}
              </p>
              <Link to={`/profile/${image.userId}`} className="no-underline">
                <p className="text-white hover:bg-slate-700">{image.displayName || "Anonymous User"}</p>
              </Link>
              <p className="text-white text-xs">
                {image.uploadedAt?.toDate().toLocaleString() || "Unknown date"}
              </p>
            </div>
          ))}
      </div>
    </>
  );
}

export default DalleImagePage;