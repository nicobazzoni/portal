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
  
  const [isOpen, setIsOpen] = useState(false); // Move the state up to Header

  return (
    <nav className="bg-stone-950">
        <div className=" px-4 py-2 mx-auto space-x-2 flex justify-between items-center">
             
            <NavbarLinks 
                userId={userId} 
                user={user} 
                handleLogout={handleLogout} 
                isOpen={isOpen} 
                setIsOpen={setIsOpen} 
            />
          
        </div>
    </nav>
  );
};

export default Header;
