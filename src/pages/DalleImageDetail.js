import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Helmet } from "react-helmet-async";
import ShareToFacebook from "../components/Share";
import CommentBox from "../components/CommentBox";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import DownloadImage from "../components/DownloadImage";
import DalleLike from "../components/DalleLike";

function DalleImageDetail() {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const userId = user?.uid || null;
  useEffect(() => { 
    const fetchImage = async () => {
      try {
        const imageRef = doc(db, "images", id);
        const imageDoc = await getDoc(imageRef);

        if (imageDoc.exists()) {
          setImage({ id: imageDoc.id, ...imageDoc.data() });
        } else {
          console.error("❌ Image not found in Firestore.");
        }
      } catch (error) {
        console.error("🔥 Error fetching image:", error);
      }

      setLoading(false);
    };

    fetchImage();
  }, [id]);

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (!image) return <div className="text-white text-center">Image not found.</div>;

  const { prompt = "AI Image", imageUrl, displayName = "Anonymous User" } = image;
  const fullImageUrl = imageUrl || "https://via.placeholder.com/300";
  
  const handleLike = async (imageId) => {
    console.log(`Liked image ID: ${imageId}`);
    // Implement like logic if needed
  };
  return (
    <div className="text-white p-4">
      {/* ✅ Open Graph Meta Tags */}
      <Helmet>
        <title>{prompt} | Portl</title>
        <meta property="og:title" content={prompt} />
        <meta property="og:image" content={fullImageUrl} />
        <meta property="og:url" content={`https://portl.life/image/${id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={`Created by ${displayName} on Portl`} />
      </Helmet>

      <button className="btn btn-primary mb-4" onClick={() => navigate(-1)}>Back</button>
      <h1 className="text-2xl text-black mb-4">{prompt}</h1>
      <div className="flex text-black justify-center mb-4">
        <img src={fullImageUrl} alt={prompt} className="max-w-full rounded-lg" />
      </div>
      <p className="text-sm italic text-black text-center">Created by: {displayName}</p>

      <div className=" relative items-center text-black flex space-between justify-between">

      <DownloadImage className='text-lg' imagePath={image.imageUrl}  fileName={`PortlImage_${image.id}.png`}  />
      <DalleLike
                  className="mt-2 text-black"
                  handleLike={() => handleLike(image.id)}
                  likes={image.likes || 0}
                  userId={userId}
                  imageId={image.id}
                />
</div>
      {/* ✅ Comments Section */}
      <CommentBox imageId={id} />
    </div>
  );
}

export default DalleImageDetail;