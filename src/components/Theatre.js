import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Adjust the path as needed
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Theatre = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'images'), orderBy('uploadedAt')),
      (snapshot) => {
        const fetchedImages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          };
        }).filter(image => image.imageUrl); // Filter out images without imageUrl
        setImages(fetchedImages);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching images:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || images.length < 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [loading, images]);

  return (
    <div className='bg-black h-screen p-1 flex justify-center items-center'>
      <h1 className='font-mono text-white absolute top-4 left-4'>m a e l s t r o m</h1>
      {loading ? (
        <p className='text-white'>Loading images...</p>
      ) : images.length < 1 ? (
        <p className='text-white'>Not enough images to display</p>
      ) : (
        <div className='w-full h-full flex flex-col justify-center items-center'>
          {images[currentImageIndex].prompt && (
            <div className='mb-4 p-2 bg-white bg-opacity-50 rounded'>
              <p className='text-black text-center'>{images[currentImageIndex].prompt}</p>
            </div>
          )}
          <img
            src={images[currentImageIndex].imageUrl}
            alt={`Image ${currentImageIndex}`}
            className='object-contain h-full max-w-full transition-opacity duration-1000 ease-in-out'
          />
        </div>
      )}
    </div>
  );
};

export default Theatre;