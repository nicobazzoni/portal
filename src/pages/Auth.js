import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { addDoc, doc, setDoc  } from "firebase/firestore";
import { collection } from "firebase/firestore";
import portal from '../components/assets/PortalLogo.png';


const initialState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = ({ setActive, setUser }) => {
  const [state, setState] = useState(initialState);
  const [signUp, setSignUp] = useState(false);
  const navigate = useNavigate();
  

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  
  
  
    const handleAuth = async (e) => {
    e.preventDefault();
  
    // For Sign In
    if (!signUp) {
      if (email && password) {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        setUser(user);
        setActive("home");
      } else {
        toast.error("Please fill out all fields");
      }
    }
    // For Sign Up
    else {
      if (password !== confirmPassword) {
        return toast.error("Passwords don't match");
      }
      if (username && email && password) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Setting default values for new fields
        await updateProfile(user, { displayName: username, photoURL: "path/to/default/profile.png", bio: "This user hasn't added a bio yet." });
  
        // Add user data to Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
            bio: "bio",
            displayName: user.displayName,
            email: user.email,
            photoURL: 'photoURL',
        });
        setUser(user);
        setActive("home");
      } else {
        toast.error("All fields are mandatory to fill");
      }
    }
    navigate("/");
  };



  // ... rest of the component remains the same
  const { username, email, password, confirmPassword } = state;

  


  return (
    <div className="container-fluid mb-4 h-screen relative">
  
    <div className="text-white">
      <h1 className="text-blue-400 text-xs font-bold tracking-widest hover:text-slate-300">create Dalle AI images</h1>
      <hr />
      <span className="text-yellow-200 hover:text-slate-300 tracking-widest font-bold">with your own text prompts</span>
      <hr />
      <h1 className="text-red-300 hover:text-slate-300 tracking-widest font-bold">share with friends! </h1>
    </div>
      <div className="container">
        
        <div className="col-12 text-center">
          <div className="text-center heading py-2">
            {signUp ? "Sign-Up" : "Sign-In"}
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <img src={portal} alt="portal" className="img-fluid h-24 mb-2 rounded-full" />
            <form className="row" onSubmit={handleAuth}>
              {signUp && (
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleChange}
                  className="rounded-md  border-none mb-2"

              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
  className="rounded  border-none mb-2"
              />
              {signUp && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                />
              )}
              <div className="col-12 py-3 text-center">
                <button className={`btn ${signUp ? "btn-sign-up" : "btn-sign-in"}`} type="submit">
                  {signUp ? "Sign-up" : "Sign-in"}
                </button>
              </div>
            </form>
            <div className="text-center justify-content-center mt-2 pt-2">
              <p className="small fw-bold text-yellow-300 mt-2 pt-1 mb-0">
                {signUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
                &nbsp;
                <span
                  className={signUp ? "link-primary" : "link-danger"}
                  style={{ textDecoration: "none", cursor: "pointer" }}
                  onClick={() => setSignUp(!signUp)}
                >
                  {signUp ? "Sign In" : "Sign Up"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
