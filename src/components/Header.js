import React from "react";
import NavbarLinks from './NavbarLinks';




const Header = ({ user, handleLogout }) => {
  const userId = user?.uid;

  return (
    <nav className="bg-stone-200 ">
        <div className="  px-4 py-2 mx-auto space-x-2 flex  justify-between items-center">
             
            <NavbarLinks 
                userId={userId} 
                user={user} 
                handleLogout={handleLogout} 
            />
          
        </div>
    </nav>
  );
};

export default Header;
