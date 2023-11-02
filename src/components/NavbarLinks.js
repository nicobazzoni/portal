import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  PlusCircleOutlined,
  GlobalOutlined,
  CommentOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import dalle from "../components/assets/brain.png";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';

const NavbarLinks = ({user, handleLogout, }) => {
    const userId = user?.uid;
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            console.log('Outside click detected.');
            setIsOpen(prevState => !prevState);
        }
    }
    

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const renderLinks = () => (
        <>
            <Link to="/" className="text-white hover:bg-sky-400 rounded-e-md p-2 block">
                <HomeOutlined style={{ fontSize: '30px' }} />
            </Link>
            
            <Link to="/blogs" className="text-white hover:bg-sky-400 rounded-md p-2 block no-underline">
    <GlobalOutlined style={{ fontSize: '30px', padding: '2px' }}  />
                <h6 className='font-xs'>portals</h6>
            </Link>
                <Link to="/create" className="text-white hover:bg-sky-400 rounded-e-md p-2 block no-underline">
                    <PlusCircleOutlined style={{ fontSize: '30px' , padding: '2px' }} />
                   <h6 className='font-xs'> create portal</h6>
                </Link>
                <Link to="/userlist" className="text-white hover:bg-sky-400 rounded-e-md p-2 block no-underline">
                    <CommentOutlined style={{ fontSize: '30px', padding: '2px' }} />
                    <h6 className='font-xs'> people</h6>
                   
                </Link>
                <Link to='dalleimagery'className="text-white hover:bg-sky-400 rounded-e-md p-2 block no-underline"> 
                <i class="bi bi-robot" style={{ fontSize: '30px', padding: '2px' }}> </i>
                <h6 className='font-xs'>dalle images </h6>
                </Link>
         

            {userId ? (
                <div className="flex flex-col items-center space-y-4 mt-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                    <Link to="/dalle" className='no-underline'>
                            <img src={dalle} alt="dalle" className="w-10 h-10 rounded-full hover:animate-pulse block no-underline" />
                            <h6 className='font-xs'>create Dalle image </h6>
                        </Link>
                        <Link to={`/profile/${userId}`} className="text-white text-xs bg-black p-1 no-underline block">
                            {user?.displayName}
                        </Link>
                        <button onClick={handleLogout} className="text-black bg-blue-200 p-2 border-none rounded-md hover:text-blue-200 block">
                            <LogoutOutlined style={{ fontSize: '30px' }} />
                        </button>
                </div>
            ) : (
                <Link to="/auth" className="text-black bg-blue-400 p-2 border-none rounded-md hover:text-blue-200 block mt-4 lg:mt-0">
                    <LoginOutlined style={{ fontSize: '30px' }} />
                </Link>
            )}
        </>
    );


  
    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden text-black border-none hover:bg-sky-400 rounded-e-md p-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {/* Mobile Side Menu */}
            {isOpen && (
                <div ref={menuRef} className="transition-transform transform translate-x-0 fixed top-0 left-0 h-full w-64 bg-black z-10">
                    <button
                        className="text-black hover:bg-sky-400 border-none rounded-e-md p-2 absolute top-0 right-0"
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
}

export default NavbarLinks;