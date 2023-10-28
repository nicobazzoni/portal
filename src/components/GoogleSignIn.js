import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase"; // Import your Firebase auth instance
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const GoogleSignIn = ({ onSuccess }) => {
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // The user is signed in with Google successfully
      const googleUser = result.user;

      // Pass the user object to the parent component's onSuccess function
      onSuccess(googleUser);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <Link to="/"> {/* Wrap the button in Link */}
      <button onClick={handleGoogleSignIn} className="btn btn-primary">
        Sign Up/In with Google
      </button>
    </Link>
  );
};

export default GoogleSignIn;
