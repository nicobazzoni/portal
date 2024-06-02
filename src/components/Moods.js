import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import LazyLoad from 'react-lazyload';

function MoodCarousel() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'images'), orderBy('uploadedAt')),
      (snapshot) => {
        const fetchedImages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(fetchedImages);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching images:', error);
        setLoading(false);
      }
    );

    // Cleanup the listener when component is unmounted
    return () => unsubscribe();
  }, []);

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
    autoplayTimeout: 2000,
    autoplaySpeed: 1000,
    smartSpeed: 500,
    dragEndSpeed: 1000,
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

  return (
    <div className='container mx-auto'>
      <h2 className='text-black text-xs font-bold font-mono  text-center'>AI Images</h2>
      {loading ? (
        <div className='text-lg font-bold font-mono'>Loading...</div>
      ) : (
        <OwlCarousel className='owl-carousel' {...options}>
          {images.map((image) => (
            <div key={image.id} className='text-black'>
              <LazyLoad height={200} offset={100} once>
                <img
                  className='rounded-full cursor-pointer'
                  src={image.imageUrl}
                  alt='Mood'
                  onClick={handleImageClick}
                />
              </LazyLoad>
              <Link to={`/profile/${image.userId}`} className='no-underline'>
                <p className='text-black no-underline'>{image.displayName}</p>
              </Link>
              <p className='text-black text-xs'>
                {image.uploadedAt.toDate().toLocaleString()}
              </p>
            </div>
          ))}
        </OwlCarousel>
      )}
    </div>
  );
}

export default MoodCarousel;