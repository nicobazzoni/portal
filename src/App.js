import { useState, useEffect } from "react";
import "./App.css";
import "./style.scss";
import "./media-query.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

import Home from "./pages/Home";
import Detail from "./pages/Detail";
import AddEditBlog from "./pages/AddEditBlog";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Auth from "./pages/Auth";
import TagBlog from "./pages/TagBlog";
import CategoryBlog from "./pages/CategoryBlog";
import ScrollToTop from "./components/ScrollToTop";
import Blogs from "./pages/Blogs";
import LandingPage from "./pages/LandingPage";
import Chat from "./pages/ChatModal";
import Ticker from "./components/Ticker";
import UserProfile from "./pages/UserProfile";
import UserList from "./pages/UserList";
import Dalle from "./components/Dalle";
import DalleImagePage from "./pages/DalleImagePage";

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

  return (
    <div className="App bg-faded overflow-y-hidden">
      <Header setActive={setActive} active={active} user={user} handleLogout={handleLogout} />
      <h6 className="text-sky-500 font-bold tracking-widest hover:bg-white bg-stone-900 cursor-pointer p-2">portal</h6>
      <ScrollToTop />
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={user?.uid ? <Navigate to="/home" /> : <Navigate to="/landing" />} />
        <Route path="/home" element={<Home setActive={setActive} active={active} user={user} />} />
        <Route path="/search" element={<Home setActive={setActive} user={user} />} />
        <Route path="/detail/:id" element={<Detail setActive={setActive} user={user} />} />
        <Route path="/create" element={user?.uid ? <AddEditBlog user={user} /> : <Navigate to="/landing" />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/dalle" element={<Dalle user={user} />} />
        <Route path="/dalleimagery" element={<DalleImagePage />} />
        <Route path="/chatmodal" element={<Chat />} />
        <Route path="/update/:id" element={user?.uid ? <AddEditBlog user={user} setActive={setActive} /> : <Navigate to="/" />} />
        <Route path="/blogs" element={<Blogs setActive={setActive} />} />
        <Route path="/tag/:tag" element={<TagBlog setActive={setActive} />} />
        <Route path="/category/:category" element={<CategoryBlog setActive={setActive} />} />
        <Route path="/profile/:id" element={user?.uid ? <UserProfile user={user} setActive={setActive} /> : <Navigate to="/" />} />
        <Route path="/auth" element={<Auth setActive={setActive} setUser={setUser} />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;