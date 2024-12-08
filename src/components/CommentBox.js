// /Users/nico/Desktop/apps/portal/src/components/CommentBox.js

import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

function CommentBox({ imageId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Get authentication state
  const [user, loadingAuth, authError] = useAuthState(auth);

  // Fetch comments in real-time
  useEffect(() => {
    const commentsRef = collection(db, "images", imageId, "comments");
    const q = query(commentsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [imageId]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments

    // Determine user details
    const userId = user ? user.uid : "guest_" + Math.random().toString(36).substr(2, 9);
    const displayName = user ? (user.displayName || "Anonymous") : "Guest";

    try {
      const commentsRef = collection(db, "images", imageId, "comments");
      await addDoc(commentsRef, {
        text: newComment,
        userId,
        displayName,
        timestamp: serverTimestamp(),
      });
      setNewComment(""); // Clear input field
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  if (loadingAuth) {
    return <div className="text-white text-center">Loading comments...</div>;
  }

  if (authError) {
    return <div className="text-red-500 text-center">Error: {authError.message}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl mb-4">Comments</h2>
      
      {/* Display existing comments */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="p-2 mb-2 border-b border-gray-700">
            <p className="font-bold">{comment.displayName || "Anonymous"}</p>
            <p>{comment.text}</p>
            <p className="text-xs italic">
              {comment.timestamp?.toDate().toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm italic">No comments yet. Be the first to comment!</p>
      )}

      {/* Input for adding a new comment */}
      <div className="mt-4">
        <textarea
          className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
          rows="3"
          placeholder={user ? "Write a comment..." : "Sign in to comment..."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user && false} // Allow guest comments
        ></textarea>
        <button
          className={`mt-2 px-4 py-2 rounded ${
            user ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
          onClick={handleAddComment}
          disabled={!user && false} // Allow guest comments
          title={!user ? "Sign in to comment" : "Add Comment"}
        >
          Add Comment
        </button>
        {!user && (
          <p className="text-sm text-gray-400 mt-2">
            <Link to="/signin" className="underline">
              Sign in
            </Link>{" "}
            to leave a comment.
          </p>
        )}
      </div>
    </div>
  );
}

export default CommentBox;