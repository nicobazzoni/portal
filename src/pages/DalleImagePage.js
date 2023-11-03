import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

function DalleImagePage({ active, setActive, user, handleLogout }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const unsubscribe = onSnapshot(query(collection(db, 'images'), orderBy('uploadedAt')), (snapshot) => {
          const fetchedImages = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          }));
          setImages(fetchedImages);
          setLoading(false);
      }, (error) => {
          console.error("Error fetching images:", error);
          setLoading(false);
      });

      // Cleanup the listener when component is unmounted
      return () => unsubscribe();

  }, [db]); 




    const handleImageClick = (e) => {
        const image = e.target;
        if (image.requestFullscreen) {
            image.requestFullscreen();
        } else if (image.mozRequestFullScreen) {
            image.mozRequestFullScreen();
        } else if (image.webkitRequestFullscreen) {
            image.webkitRequestFullscreen();
        } else if (image.msRequestFullscreen) {
            image.msRequestFullscreen();
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    const userId = images.userId

    return (
        <>
            <h2 className='text-white text-center'>User Dalle AI images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-4 overflow-y-auto">
            {images.map(image => (
  console.log(images, 'imageData'),
  <div key={image.id}>
    <img className='h-38 w-full object-cover' src={image.imageUrl} alt="Mood" onClick={handleImageClick} />
    <Link to={`/profile/${image.userId}`} className='no-underline '  >  <p className='text-white hover:bg-slate-700'> {image.displayName}</p></Link>
    <p className='text-white text-xs'> {image.uploadedAt.toDate().toLocaleString()}</p>
  </div>
))}
            </div>
        </>
    );
}

export default DalleImagePage;