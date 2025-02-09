import { useState, useEffect } from "react";
import "./App.css";
import "./style.scss";
import "./media-query.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import DalleImageDetail from "./pages/DalleImageDetail";

import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Auth from "./pages/Auth";
import Footer from "./components/Footer";

import ScrollToTop from "./components/ScrollToTop";

import LandingPage from "./pages/LandingPage";

import UserProfile from "./pages/UserProfile";
import UserList from "./pages/UserList";
import Dalle from "./components/Dalle";
import DalleImagePage from "./pages/DalleImagePage";
import ImageDetailPage from "./pages/ImageDetailPage";

// Import ChatContext


function App() {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser || null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setActive("login");
        navigate("/landing");
      })
      .catch((error) => console.error("Error signing out:", error));
  };

  // Function to close the chat modal


  return (
  
      <div className="App bg-faded overflow-y-hidden">
        <Header setActive={setActive} active={active} user={user} handleLogout={handleLogout} />
     
        <ScrollToTop />
        <ToastContainer position="top-center" />
        <Routes>
          <Route path="/" element={user?.uid ? <Navigate to="/home" /> : <Navigate to="/landing" />} />
          <Route path="/home" element={<Home setActive={setActive} active={active} user={user} />} />
          <Route path="/search" element={<Home setActive={setActive} user={user} />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/dalle" element={<Dalle user={user} />} />
          <Route path="/dalleimagery" element={<DalleImagePage />} />
          <Route path="/image/:id" element={<DalleImageDetail />} />
          <Route path="/image/:id" element={<ImageDetailPage />} />  {/* ✅ Add this route */}
     
          <Route path="/profile/:id" element={user?.uid ? <UserProfile user={user} setActive={setActive} /> : <Navigate to="/" />} />
          <Route path="/auth" element={<Auth setActive={setActive} setUser={setUser} />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/about" element={<About />} />

        </Routes>
      </div>
   
  );
}

export default App 