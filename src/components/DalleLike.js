import React, { useState } from "react";
import { doc, runTransaction } from "firebase/firestore";
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
      let updatedLikes;
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(imageRef);
        if (!snapshot.exists()) throw new Error("Image not found");

        const currentLikes = snapshot.data().likes || {};
        updatedLikes = { ...currentLikes, [userId]: !currentLikes[userId] };
        transaction.update(imageRef, { likes: updatedLikes });
      });

      // Update local state
      setIsLiked(Boolean(updatedLikes[userId]));
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
      className="bg-transparent text-inherit border-none text-xl  mt-2"
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
