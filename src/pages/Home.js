import React, { useState, useEffect, useRef } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import MoodCarousel from "../components/Moods";
import DalleImagePage from "./DalleImagePage";

const Home = ({ setActive, user }) => {

  const toastShown = useRef(false); // Track if the toast has been shown

  // Fetch trending blogs


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
   
  }, [setActive, user]);


  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <MoodCarousel path="/moods"  />
       
      </div>
    </div>
  );
};

export default Home;