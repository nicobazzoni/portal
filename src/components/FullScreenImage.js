import React, { useRef, useState } from "react";

const FullscreenImage = ({ src, alt }) => {
  const imgRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleImageClick = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <div>
      {/* Regular Image */}
      <img
    ref={imgRef}
    src={src}
    alt={alt}
    className="cursor-pointer w-full h-auto object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105"
    onClick={handleImageClick}
  />

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={handleCloseFullscreen}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-xl p-2 bg-gray-800 rounded-full"
            onClick={handleCloseFullscreen}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default FullscreenImage;