import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import CommentBox from "../components/CommentBox";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";  // Import Helmet

function DalleImageDetail() {
  const { id } = useParams(); 
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, loadingAuth, authError] = useAuthState(auth);

  const safeRender = (content, fallback = "") => {
    if (typeof content === "string" || typeof content === "number") return content;
    if (content && typeof content === "object") return JSON.stringify(content);
    return fallback;
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageRef = doc(db, "images", id);
        const imageDoc = await getDoc(imageRef);

        if (imageDoc.exists()) {
          const imageData = { id: imageDoc.id, ...imageDoc.data() };
          setImage(imageData);
        } else {
          setError("Image not found");
        }
      } catch (err) {
        console.error("Error fetching image:", err);
        setError("Failed to load image");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  if (loading || loadingAuth) return <div className="text-white text-center">Loading...</div>;
  if (error || authError) return <div className="text-red-500 text-center">{error || authError.message}</div>;
  if (!image) return <div className="text-white text-center">No image data found</div>;

  const prompt = safeRender(image.prompt, "No prompt available");
  const displayName = safeRender(image.displayName, "Anonymous User");
  const imageUrl = typeof image.imageUrl === "string" ? image.imageUrl : "https://via.placeholder.com/300";
  const timestamp = image.timestamp ? image.timestamp.toDate().toLocaleString() : "Unknown date";
  const likesCount = image.likes && typeof image.likes === "object" ? Object.values(image.likes).filter(Boolean).length : 0;

  return (
    <div className="text-white p-4">
      {/* Helmet for dynamic meta tags */}
      <Helmet>
        <title>{prompt} | Portl</title>
        <meta property="og:title" content={prompt} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={`https://portl.life/image/${id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={`Created by ${displayName} on Portl`} />
      </Helmet>

      <button className="btn btn-primary mb-4" onClick={() => navigate(-1)}>Back</button>
      <h1 className="text-2xl mb-4">{prompt}</h1>
      <div className="flex justify-center mb-4">
        <img src={imageUrl} alt={prompt} className="max-w-full rounded-lg" />
      </div>
      <p className="text-sm italic text-center">Created by: {displayName}</p>
      <p className="text-xs text-center">{timestamp}</p>
      <p className="text-center mt-4">Likes: {likesCount}</p>

      {/* Comments Section */}
      <CommentBox imageId={id} />
    </div>
  );
}

export default DalleImageDetail;