import React from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import portal from "./assets/portal.png";
import { useParams } from "react-router-dom";

const Header = ({ active, setActive, user, handleLogout }) => {
  const userId = user?.uid;
  const { id } = useParams();
  console.log("UID from URL:", id);

  return (
    <nav className="bg-slate-900 no-underline navbar navbar-expand-lg navbar-light">
      <div className="container-fluid px-0 mx-auto flex flex-col">
        <nav className="bg-black text-white  p-4 navbar navbar-toggleable-md navbar-light">
          <div className="container mx-auto">
            <div className="flex space-between items-center ">
              <button
                className="lg:hidden rounded-md border-none"
                onClick={() => setActive(!active)}
              >
                <div className=" text-2xl  rounded-md p-1"></div>
              </button>
              <div
                className={`${
                  active ? "block" : "hidden"
                } lg:flex lg:space-x-4 no-underline space-x-2`}
              >
                <Link
                  to="/"
                  className="text-white no-underline hover:text-blue-200"
                >
                  Home
                </Link>
                <Link
                  to="/blogs"
                  className="text-white no-underline hover:text-blue-200"
                >
                  Blogs
                </Link>
                <Link
                  to="/create"
                  className="text-white no-underline hover:text-blue-200"
                >
                  Create
                </Link>
                <Link
                  to="/images"
                  className="text-white no-underline hover:text-blue-200"
                >
                  Images
                </Link>
                <Link
                  to="/chat"
                  className="text-white no-underline hover:text-blue-200"
                >
                  Chat
                </Link>
                {userId ? (
                  <>
                    <div className="flex items-center space-x-2 gap-2">
                      <Avatar
                        name={user?.displayName}
                        round="20px"
                        size="25"
                      />
                      <Link
                        to={`/profile/${userId}`}
                        className="text-white hover:text-blue-200 no-underline"
                      >
                        {user?.displayName}
                      </Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-black hover:text-blue-200 border rounded-md p-1"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="text-white hover:text-blue-200"
                  >
                    Login
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
            className="portal"
            height={40}
            width={40}
          />
        </div>
      </div>
    </nav>
  );
};

export default Header;
