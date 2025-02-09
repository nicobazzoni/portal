import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import ShareToFacebook from "../components/Share";

const ImageDetailPage = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      const imageRef = doc(db, "images", id);
      const imageSnap = await getDoc(imageRef);

      if (imageSnap.exists()) {
        const imageData = { id: imageSnap.id, ...imageSnap.data() };
        setImage(imageData);
        setLoading(false);

        // Set Open Graph Meta Tags for Facebook Sharing
        const metaImg = document.createElement('meta');
        metaImg.setAttribute('property', 'og:image');
        metaImg.content = imageData.imageUrl;

        const metaUrl = document.createElement('meta');
        metaUrl.setAttribute('property', 'og:url');
        metaUrl.content = `https://portl.life/image/${id}`;

        const metaTitle = document.createElement('meta');
        metaTitle.setAttribute('property', 'og:title');
        metaTitle.content = imageData.prompt || "Check out this image on Portl!";

        document.head.appendChild(metaImg);
        document.head.appendChild(metaUrl);
        document.head.appendChild(metaTitle);

        return () => {
          document.head.removeChild(metaImg);
          document.head.removeChild(metaUrl);
          document.head.removeChild(metaTitle);
        };
      } else {
        console.error("Image not found");
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  if (loading) {
    return <div className="text-white text-center">Loading image...</div>;
  }

  if (!image) {
    return <div className="text-white text-center">Image not found.</div>;
  }

  return (
    <div className="p-4 text-white">
      <h2 className="text-center text-xl mb-4">{image.prompt}</h2>
      <img src={image.imageUrl} alt={image.prompt} className="w-full max-w-lg mx-auto rounded-lg" />
      <p className="text-center mt-2">Uploaded by {image.displayName || "Anonymous"}</p>
      <p className="text-center text-sm">{image.timestamp?.toDate().toLocaleString()}</p>

      <div className="flex justify-center mt-4">
        <ShareToFacebook imageUrl={image.imageUrl} imageId={image.id} title={image.prompt} />
      </div>
    </div>
  );
};

export default ImageDetailPage;