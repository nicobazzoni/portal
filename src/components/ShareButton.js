import React from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
    TwitterIcon,
} from 'react-share';

const ShareButton = ({ imageUrl, description }) => {
  return (
    <div className="share-buttons">
      <FacebookShareButton url={imageUrl} quote={description}>
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>
        <TwitterShareButton url={imageUrl} title={description}> 
        <TwitterIcon size={32} round={true} />
        </TwitterShareButton>
      {/* Add other social share buttons as needed */}
    </div>
  );
}

export default ShareButton;
