import React from 'react';

const ShareToFacebook = ({ imageId }) => {
  // This will just share the page URL without any fancy previews
  const previewUrl = `https://portl.life/image/${imageId}`;

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