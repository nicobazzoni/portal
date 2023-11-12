import React from "react";

const DalleLike = ({ handleLike, likes, userId, imageId }) => {
  const LikeStatus = () => {
    // Ensure 'likes' is an object before performing any operation
    if (likes && typeof likes === 'object') {
      const userLiked = userId && likes[userId];
      const likesCount = Object.values(likes).filter(like => like).length;

      if (likesCount > 0) {
        return (
          <>
            <i className={`bi ${userLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`} />
            &nbsp;{likesCount} 
          </>
        );
      }
    }

    return (
      <>
        <i className="bi bi-hand-thumbs-up" />
      
      </>
    );
  };

  return (
    <span>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleLike(imageId)}
        title={userId ? 'Like' : 'Please Login to like post'}
      >
        <LikeStatus />
      </button>
    </span>
  );
};

export default DalleLike;
