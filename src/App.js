import { useState, useEffect } from "react";
import "./App.css";
import "./style.scss";
import "./media-query.css";
import Home from "./pages/Home";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Detail from "./pages/Detail";
import AddEditBlog from "./pages/AddEditBlog";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Auth from "./pages/Auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import TagBlog from "./pages/TagBlog";
import CategoryBlog from "./pages/CategoryBlog";
import ScrollToTop from "./components/ScrollToTop";
import Blogs from "./pages/Blogs";

import Chat from "./pages/ChatModal";
import Ticker from "./components/Ticker";

import UserProfile from "./pages/UserProfile";
import UserList from "./pages/UserList";

import Dalle from "./components/Dalle";

import DalleImagePage from "./pages/DalleImagePage";
import Landing from "./pages/Landing";
import Theatre from "./components/Theatre";
import VideoUploader from "./components/VideoUploader";
import VideoSlider from "./components/VideoSlider";

function App() {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setActive("login");
      navigate("/landing");
    });
  };

  //create back button for detail page
  
  

  return (
  
    <div className="App bg-white text-black overflow-y-hidden ">
      <Header
        setActive={setActive}
        active={active}
        user={user}
        handleLogout={handleLogout}
       
      />

  
   
      
      <ScrollToTop />
      
      <ToastContainer position="top-center" />
    
      <Routes>
        <Route path = "/theatre"
        element = { <Theatre />}  />

        <Route 
        path = "/landing"
        element = {<Landing />} />
        <Route
          path="/"
          element={<Home setActive={setActive} active={active} user={user} />}
        />
        <Route
          path="/search"
          element={<Home setActive={setActive} user={user} />}
        />
        <Route
          path="/detail/:id"
          element={<Detail setActive={setActive} user={user} />}
        />
        <Route
          path="/create"
          element={
            user?.uid ? <AddEditBlog user={user} /> : <Navigate to="/" />
          }
        />
          <Route
          path="/userlist"
          element={
             <UserList /> 
          }
        />
        <Route 
        path = "/video"
        element={<VideoUploader />} />
        <Route 
        path = "/videoslider"
        element={<VideoSlider />} />
        <Route 
        path="/dalle" 
        element={<Dalle    user={user} />} />
         <Route 
        path="/dalleimagery" 
        element={<DalleImagePage />} />
       <Route
        path="/chatmodal"
        element= { <Chat />}
      />
     

        <Route
          path="/update/:id"
          element={
            user?.uid ? (
              <AddEditBlog user={user} setActive={setActive} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      
        <Route path="/blogs" element={<Blogs setActive={setActive} />} />
        <Route path="/tag/:tag" element={<TagBlog setActive={setActive} />} />
        <Route path="/category/:category" element={<CategoryBlog setActive={setActive}  />} />
    
        
        <Route 
  path="/profile/:id" 
  element={ 
    user?.uid 
    ? <UserProfile user={user} setActive={setActive} />
    : <Navigate to="/" />
  } 
/>

        <Route
          path="/auth"
          element={<Auth setActive={setActive} setUser={setUser} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
