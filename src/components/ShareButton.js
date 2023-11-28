import React from 'react';

const ShareButton = ({ imageId, imageUrl, caption }) => {
  const handleShare = () => {
    const instagramShareUrl = `https://www.instagram.com/share?url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}`;
    window.open(instagramShareUrl, '_blank');
  };

  return (
    <button onClick={handleShare} className='bg-blue-500 text-white p-1 mt-1 cursor-pointer'>
      Share on Instagram
    </button>
  );
};

export default ShareButton;