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

const Header = ({ active, setActive, user, handleLogout }) => {
  const userId = user?.uid;
  const { id } = useParams();

  return (
    <nav className="bg-slate-900">
      <div className="container-fluid px-4 py-2 mx-auto flex justify-between items-center">
        <Link to="/">
          <img src={portal} alt="portal" className="w-10 h-10" />
        </Link>
        <div className="flex items-center space-x-4">
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
          {userId ? (
            <div className="flex items-center space-x-2">
              <Link to={`/profile/${userId}`} className="text-white no-underline hover:text-blue-200">
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
          <Link to="/dalle">
            <img src={dalle} alt="dalle" className="w-10 h-10" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
