import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpButton = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/auth'); // Adjust this path based on your routing setup
  };

  return (
    <button
      onClick={handleSignUpClick}
      className="bg-slate-50 text-black mb-2 mt-2 border-none tracking-wide hover:bg-blue-100  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Sign Up/Sign In
    </button>
  );
};

export default SignUpButton;