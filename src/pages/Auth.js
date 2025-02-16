import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import portal from "../components/assets/PortalLogo.png";

const Auth = ({ setActive, setUser }) => {
  const [signUp, setSignUp] = useState(false);
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = state;

    if (!email || !password) {
      return toast.error("Please fill out all fields");
    }

    if (signUp) {
      if (password !== confirmPassword) {
        return toast.error("Passwords don't match");
      }
      if (username) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: username });

        await setDoc(doc(db, "users", user.uid), {
          displayName: username,
          email: user.email,
        });

        setUser(user);
      }
    } else {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setUser(user);
    }

    setActive("home");
    navigate("/");
  };

  return (
    <div className="h-screen flex justify-center items-center bg-white">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img src={portal} alt="Portal Logo" className="h-16 mb-4" />
          <h2 className="text-xl font-bold mb-4">{signUp ? "Sign Up to Portl" : "Sign In To Portl"}</h2>
        </div>
        <form onSubmit={handleAuth} className="flex flex-col space-y-3">
          {signUp && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={state.username}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={state.email}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={state.password}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          {signUp && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={state.confirmPassword}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          )}
          <button type="submit" className="bg-blue-500 text-white py-2 rounded mt-2">
            {signUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          {signUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setSignUp(!signUp)}
          >
            {signUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;