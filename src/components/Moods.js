import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

function MoodCarousel({ active, setActive, user, handleLogout }) {
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


    const options = {
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
              
            0: {
                items: 1,
            },
            400: {
                items: 2,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 4,
            },

          1400: {
            items: 6,
          },
        },
        autoplayTimeout: 5000,
        autoplaySpeed: 500,
        smartSpeed: 1000,
        dragEndSpeed: 3000,
    };

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

    return (
        <>
            <h2 className='text-white text-center'>User Dalle AI images</h2>
            <OwlCarousel autoplay {...options}>
            {images.map(image => (
              console.log(images, 'imageData'),
              <div key={image.id}>
              <img className='rounded-sm' src={image.imageUrl} alt="Mood" onClick={handleImageClick} />
              <p className='text-white'> {image.displayName}</p>
              <p className='text-white text-xs'> {image.uploadedAt.toDate().toLocaleString()}</p>
             
            </div>
                ))}
            </OwlCarousel>
        </>
    );
}

export default MoodCarousel;
