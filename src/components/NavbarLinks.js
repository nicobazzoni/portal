// NavbarLinks.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  HomeOutlined,
  PlusCircleOutlined,
  GlobalOutlined,
  CommentOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import dalle from "../components/assets/brain.png";
import { auth } from '../firebase'; // Adjust the path
// Adjust the path
const NavbarLinks = ({user, handleLogout}) => {
    const userId = user?.uid;
  return (
    <>
    <div className='flex justify-between items-center space-x-4'>
      <Link to="/" className="text-white hover:text-blue-200">
        <HomeOutlined style={{ fontSize: '30px' }} />
      </Link>
      <Link to="/blogs" className="text-white hover:text-blue-200">
        <GlobalOutlined style={{ fontSize: '30px' }} />
      </Link>
      <Link to="/create" className="text-white hover:text-blue-200">
        <PlusCircleOutlined style={{ fontSize: '30px' }} />
      </Link>
      <Link to="/userlist" className="text-white hover:text-blue-200">
        <CommentOutlined style={{ fontSize: '30px' }} />
      </Link>
      </div>
      {userId ? (
            <div className="flex items-center  space-x-4">
                <Link to="/dalle">
            <img src={dalle} alt="dalle" className="w-10 h-10 rounded-full" />
          </Link>
              
              <Link to={`/profile/${userId}`} className="text-white text-xs bg-black p-1 no-underline hover:text-blue-200">
                {user?.displayName}
              </Link> 

              
              <button onClick={handleLogout} className="text-black bg-blue-200 p-2 border-none rounded-md hover:text-blue-200">
                <LogoutOutlined style={{ fontSize: '30px' }} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="text-black bg-blue-400 p-2 border-none rounded-md hover:text-blue-200">
              <LoginOutlined style={{ fontSize: '30px' }} />
            </Link>
          )}
          
    </>
  );
}

export default NavbarLinks;
