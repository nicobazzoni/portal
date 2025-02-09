import React from 'react';

const ShareToFacebook = ({ imageId }) => {
  // Point to the Next.js app for sharing
  const previewUrl = `https://https://portl-shar-fspjan8oj-nicobazzonis-projects.vercel.app/image/${imageId}`;

  // Share function to open the Facebook share dialog
  const handleShare = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(previewUrl)}`;
    window.open(facebookShareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <button 
      onClick={handleShare} 
      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
    >
      Share to Facebook
    </button>
  );
};

export default ShareToFacebook;