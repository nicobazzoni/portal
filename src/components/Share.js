const ShareToFacebook = ({ imageId }) => {
  const shareUrl = `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/serveImageMetadata/${imageId}`;

  const handleShare = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  };

  return (
    <button onClick={handleShare} className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
        <path d="M22 12.07C22 6.54 17.52 2 12 2S2 6.54 2 12.07c0 4.9 3.52 8.94 8.12 9.82v-6.95H7.62v-2.87h2.5v-2.2c0-2.47 1.48-3.84 3.73-3.84 1.08 0 2.2.19 2.2.19v2.38h-1.24c-1.22 0-1.6.76-1.6 1.54v1.93h2.72l-.44 2.87h-2.28v6.95C18.48 21.01 22 16.97 22 12.07z"/>
      </svg>
    </button>
  );
};

export default ShareToFacebook;