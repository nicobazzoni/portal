
import './App.css';
import './style.scss'
import {useState, useEffect} from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Detail from './pages/Detail';
import About from './pages/About';
import AddEditBlog from './pages/AddEditBlog';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Auth from './pages/Auth';
import { auth } from "./firebase";
import { signOut } from "firebase/auth";


function App() {

  const [active, setActive] = useState("home")
  const [user, setUser] = useState(null) 
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

  return (
    <div className="App">
      <Header setactive={setActive} active={setActive} user={user} handleLogout={handleLogout}/>
      <ToastContainer position='top-center'/>
   <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/detail/:id" element={<Detail/>}/>
    <Route path="/create" element={<AddEditBlog/>}/>
    <Route path="/about" element={<About/>}/> 
    <Route path="/auth" element={<Auth setActive={setActive}/>}/>
    <Route path="*" element={<NotFound/>}/>
   
   </Routes>
    </div>
  );
}

export default App;
