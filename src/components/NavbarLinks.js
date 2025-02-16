import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  PlusCircleOutlined,
  GlobalOutlined,
  CommentOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import dalle from "../components/assets/dalle.png";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useEffect } from "react";

const NavbarLinks = ({ user, handleLogout }) => {
  const userId = user?.uid;
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderLinks = () => (
    <>
      <Link
        to="/home"
        className="text-black hover:bg-slate-400 rounded-e-md p-2 block"
      >
        <HomeOutlined style={{ fontSize: "30px" }} />
      </Link>

      <Link
        to="/userlist"
        className="text-black hover:bg-slate-400 rounded-e-md p-2 block no-underline"
      >
        <CommentOutlined style={{ fontSize: "30px", padding: "2px" }} />
        <h6 className="font-xs">people</h6>
      </Link>
      <Link
        to="dalleimagery"
        className="text-black hover:bg-slate-400 rounded-e-md p-2 block no-underline"
      >
        <i
          className="bi bi-robot"
          style={{ fontSize: "30px", padding: "2px" }}
        ></i>
        <h6 className="font-xs">dalle images </h6>
      </Link>
      {userId && (
        <Link
          to="/dalle"
          className="flex flex-col items-center justify-center text-black hover:bg-slate-400 mr-2 rounded-md p-2 no-underline"
        >
          <img
            src={dalle}
            alt="dalle"
            className="h-9 rounded-full bg-white hover:animate-pulse block no-underline"
          />
          <h6 className="text-xs mt-1">create Dalle image</h6>
        </Link>
      )}

      {userId ? (
        <div className="flex flex-col items-center space-y-4 mt-2 lg:flex-row lg:space-y-0 lg:space-x-4">
          <Link
            to={`/profile/${userId}`}
            className="text-black text-xs bg-white p-1 no-underline block"
          >
            {user?.displayName}
          </Link>
          <button
            onClick={handleLogout}
            className="text-black bg-blue-200 p-2 border-none rounded-md hover:text-blue-200 block"
          >
            <LogoutOutlined style={{ fontSize: "30px" }} />
          </button>
        </div>
      ) : (
        <Link
          to="/auth"
          className="text-black bg-blue-400 p-2 border-none rounded-md hover:text-blue-200 block mt-4 lg:mt-0"
        >
          <LoginOutlined style={{ fontSize: "30px" }} />
        </Link>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden flex flex-col justify-between h-10 w-12 border-none  text-black p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block w-full h-1 bg-white rounded-sm"></span>
        <span className="block w-full h-1 bg-white rounded-sm"></span>
        <span className="block w-3/4 h-1 bg-white rounded-sm ml-auto"></span> {/* Smaller last line */}
      </button>

      {/* Mobile Side Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="transition-transform transform bg-opacity-5 translate-x-0 fixed top-0 left-0 h-full w-64 bg-white z-10"
        >
          <button
            className="text-black hover:bg-slate-400 border-none rounded-e-md p-2 absolute top-0 right-0"
            onClick={() => setIsOpen(false)}
          >
            X
          </button>
          {renderLinks()}
        </div>
      )}

      {/* Traditional Navbar for Larger Screens */}
      <div className="hidden lg:flex lg:w-full lg:justify-between lg:items-center px-4">
        {renderLinks()}
      </div>
    </>
  );
};

export default NavbarLinks;