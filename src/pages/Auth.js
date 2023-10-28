import React, { useState } from "react";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import portal from '../components/assets/PortalLogo.png';
import GoogleSignIn from "../components/GoogleSignIn"; // Import your Google sign-in component
import { db } from "../firebase";

const initialState = {
  username: "",
};

const Auth = ({ setActive, setUser }) => {
  const [state, setState] = useState(initialState);
  const { username } = state;

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <h2 className="text-center heading py-2 text-white bg-black"> portal </h2>
        <img src={portal} alt="portal" className="img-fluid h-30 mt-4" />
        <div className="col-12 text-center">
          <div className="text-center heading py-2">Sign In</div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
        

            {/* Render the Google sign-in component */}
            <div className="col-12 py-3 text-center">
              <GoogleSignIn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
