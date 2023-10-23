import React from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import portal from "./assets/PortalLogo.png";
import { useParams } from "react-router-dom";
import {HomeOutlined, PlusCircleOutlined, GlobalOutlined,LogoutOutlined, LoginOutlined,CommentOutlined  }  from "@ant-design/icons";


const Header = ({ active, setActive, user, handleLogout }) => {
  const userId = user?.uid;
  const { id } = useParams();
  console.log("UID from URL:", id);


  const P = <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">

  <circle cx="50" cy="50" r="45" fill="#007BFF" />


  <text x="30" y="60" font-family="Arial" font-size="48" fill="#FFFFFF">P</text>
</svg>


  return (
    <nav className="bg-slate-900 no-underline navbar navbar-expand-lg navbar-light">
      <div className="container-fluid px-0 mx-auto flex flex-col">
        <nav className="bg-black text-white  p-4 navbar navbar-toggleable-md navbar-light">
          <div className="container mx-auto">
            <div className="flex  items-center ">
          
              <div
                className={`${
                  active ? "block" : "hidden"
                } lg:flex lg:space-x-4 no-underline  space-x-4`}
              >
                <Link
                  to="/"
                  className="text-white no-underline hover:text-blue-200"
                 

                > <HomeOutlined  style={{ fontSize: '30px', color: '#fff' }}  /> 
                  
                </Link>
                <Link
                  to="/blogs"
                  className="text-white no-underline hover:text-blue-200"
                >
                  < GlobalOutlined style={{ fontSize: '30px', color: '#fff' }}  />
                </Link>
                <Link
                  to="/create"
                  className="text-white no-underline hover:text-blue-200"
                >
                 < PlusCircleOutlined style={{ fontSize: '30px', color: '#fff' }} />
                </Link> 
              
             
            
                {userId ? (
                  <>
                    <div className="flex items-center space-x-2 gap-2">
                    
                      <Link
                        to={`/profile/${userId}`}
                        className="text-white hover:text-blue-200 no-underline"
                      >
                        {user?.displayName}
                      </Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-black bg-blue-200 border-none hover:text-blue-200  rounded-md p-1"
                    >
                     <LogoutOutlined style={{ fontSize: '30px', color: '#fff' }}  />
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className=" text-black bg-blue-400 border-none hover:text-blue-200  rounded-md p-1"
                  >
                    <LoginOutlined/>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className="logo">
        <div>
          <img
            src={portal}
            alt="portal"
            className="hidden lg:block"
            height={40}
            width={40}
          />
        </div>
      </div>
    </nav>
  );
};

export default Header;
