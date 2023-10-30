import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase"; // Import your Firebase auth instance
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const GoogleSignIn = ({ onSuccess }) => {
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // The user is signed in with Google successfully
      const googleUser = result.user;

      // Check if onSuccess is a function before calling it
      if (typeof onSuccess === "function") {
        onSuccess(googleUser);
      }

      // Navigate to the root path
      navigate("/"); // Corrected this line

    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <button onClick={handleGoogleSignIn} className="btn btn-primary">
      Sign Up/In with Google
    </button>
  );
};

export default GoogleSignIn;
