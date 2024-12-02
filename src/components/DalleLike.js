import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const DalleLike = ({ likes = {}, userId, imageId }) => {
  const [isLiked, setIsLiked] = useState(likes[userId] || false);
  const [likesCount, setLikesCount] = useState(
    Object.values(likes).filter((like) => like).length
  );
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!userId) {
      alert("Please log in to like this image.");
      return;
    }

    setLoading(true); // Set loading state
    try {
      const imageRef = doc(db, "images", imageId);
      const updatedLikes = { ...likes, [userId]: !isLiked };

      // Update Firestore
      await setDoc(imageRef, { likes: updatedLikes }, { merge: true });

      // Update local state
      setIsLiked(!isLiked);
      setLikesCount(Object.values(updatedLikes).filter((like) => like).length);
    } catch (error) {
      console.error("Error updating likes:", error);
      alert("Failed to update like. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <button
      type="button"
      className="btn btn-primary mt-2"
      onClick={handleLike}
      disabled={loading} // Disable button when loading
    >
      <i
        className={`bi ${
          isLiked ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"
        }`}
      />
      &nbsp;{likesCount > 0 ? likesCount : ""}
    </button>
  );
};

export default DalleLike;