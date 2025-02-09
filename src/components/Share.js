import React from 'react';

const ShareToFacebook = ({ imageId }) => {
  const previewUrl = `https://portl-shar.vercel.app/image/${imageId}`;

  const handleShare = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(previewUrl)}`;
    window.open(facebookShareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <button 
      onClick={handleShare} 
      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-400"
    >
      Share to Facebook
    </button>
  );
};

export default ShareToFacebook;