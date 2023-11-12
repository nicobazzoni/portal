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
import Lights from "./components/Lights";
import ImageUpload from "./pages/ImageUpload";
import Chat from "./pages/ChatModal";
import Ticker from "./components/Ticker";
import Schedule from "./components/Schedule";
import UserProfile from "./pages/UserProfile";
import UserList from "./pages/UserList";
import BingImage from "./pages/BingImage";
import MoviePage from "./pages/MoviePage";
import Dalle from "./components/Dalle";
import MoodCarousel from "./components/Moods";
import DalleImagePage from "./pages/DalleImagePage";


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
      navigate("/auth");
    });
  };

  //create back button for detail page
  
  

  return (
  
    <div className="App bg-faded overflow-y-hidden ">
      <Header
        setActive={setActive}
        active={active}
        user={user}
        handleLogout={handleLogout}
       
      />
      <h6 className="text-sky-500 font-bold tracking-widest">portal</h6>
  
   
      
      <ScrollToTop />
      
      <ToastContainer position="top-center" />
    
      <Routes>
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
        path="/dalle" 
        element={<Dalle    user={user} />} />
         <Route 
        path="/dalleimagery" 
        element={<DalleImagePage />} />
       <Route
        path="/chatmodal"
        element= { <Chat />}
      />
        {/* <Route path="/schedule" element={<Schedule />} /> */}

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
        {/* <Route path="/bingimage" element={<BingImage setActive={setActive} />} />
        <Route path="/movies" element={<MoviePage setActive={setActive} />} /> */}
        <Route path="/blogs" element={<Blogs setActive={setActive} />} />
        <Route path="/tag/:tag" element={<TagBlog setActive={setActive} />} />
        <Route path="/category/:category" element={<CategoryBlog setActive={setActive}  />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/lights" element={<Lights />} /> */}
        {/* <Route path="/images" element={<ImageUpload />} /> */}
        <Route path="/ticker" element={<Ticker />} />
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
