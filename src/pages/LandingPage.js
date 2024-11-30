import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="https://storage.googleapis.com/new-music/yikes%20visual%20.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Portl.life
        </h1>
        <p className="text-lg md:text-2xl mb-6">
          Step into the world of creativity and innovation
        </p>
        <Link to="/auth" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105">
          Explore Now
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;