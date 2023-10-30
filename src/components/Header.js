import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  HomeOutlined,
  PlusCircleOutlined,
  GlobalOutlined,
  LogoutOutlined,
  LoginOutlined,
  CommentOutlined
} from "@ant-design/icons";
import dalle from "../components/assets/brain.png";
import DalleButton from "./Dalle";
import portal from "../components/assets/PortalLogo.png";
import NavbarLinks from './NavbarLinks'; // Assuming they're in the same directory
import { useState } from 'react';




const Header = ({ active, setActive, user, handleLogout }) => {
  const userId = user?.uid;
  const { id } = useParams();
  const [isDropdownOpen, setDropdownOpen] = useState(false);


  return (
    <nav className="bg-slate-900">
        <div className="container-fluid px-4 py-2 mx-auto flex justify-between items-center">
            
            <NavbarLinks userId={userId} user={user} handleLogout={handleLogout} />
        </div>
    </nav>
);

};

export default Header;
