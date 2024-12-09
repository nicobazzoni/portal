import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";


import MoodCarousel from "../components/Moods";
import Footer from "../components/Footer";

const Home = ({ setActive, user }) => {

  const toastShown = useRef(false); // Track if the toast has been shown



  useEffect(() => {
    if (!user && !toastShown.current) {
      toast.info("Please sign in to create AI images.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      toastShown.current = true; // Set toastShown to true after showing the toast
    }
  }, [user]);

  return (
    <div className="relative">
 

      {/* Main Content */}
      <div className="main-content p-4">
        <MoodCarousel path="/moods" />
      </div>
      <Footer />
    </div>
  );
};

export default Home;