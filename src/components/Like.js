import React from "react";
import { Tooltip } from "bootstrap";

const Like = ({ handleLike, likes, userId, imageId }) => {
  const LikeStatus = () => {
    const userLiked = userId && likes && likes.includes(userId);

    if (likes?.length > 0) {
      return (
        <>
          <i className={`bi ${userLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`} />
          &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }
    return (
      <>
        <i className="bi bi-hand-thumbs-up" />
        &nbsp;Like
      </>
    );
  };

  return (
    <span>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleLike(imageId)} // Ensure to pass imageId to handleLike
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title={userId ? 'Like' : 'Please Login to like post'}
      >
        <LikeStatus />
      </button>
    </span>
  );
};

export default Like;
