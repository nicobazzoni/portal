import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Adjust the path as needed
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Theatre = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'images'), orderBy('uploadedAt')),
      (snapshot) => {
        const fetchedImages = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Fetched image data:', data); // Debugging line
          return {
            id: doc.id,
            ...data
          };
        }).filter(image => image.imageUrl); // Filter out images without imageUrl
        console.log('Filtered images:', fetchedImages); // Debugging line
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
    if (loading || images.length < 2) return;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const blendImages = () => {
      console.log('Starting image blend process'); // Debugging line

      const img1 = new Image();
      const img2 = new Image();
      const img3 = new Image();

      const randomIndices = [];
      while (randomIndices.length < 2) {
        const randomIndex = Math.floor(Math.random() * images.length);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }

      const firstImage = images[randomIndices[0]];
      const secondImage = images[randomIndices[1]];
      const thirdImage = images[randomIndices[2]]

      console.log('Selected image objects:', firstImage, secondImage, thirdImage); // Debugging line

      if (!firstImage || !secondImage) {
        console.error('Invalid image objects:', firstImage, secondImage);
        return;
      }

      const firstImageUrl = firstImage.imageUrl;
      const secondImageUrl = secondImage.imageUrl;

      console.log('Selected image URLs:', firstImageUrl, secondImageUrl); // Debugging line

      if (!firstImageUrl || !secondImageUrl) {
        console.error('Invalid image URLs:', firstImageUrl, secondImageUrl);
        return;
      }

      const handleImageLoad = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
        console.log('Blended images'); // Debugging line
      };

      img1.onload = () => {
        console.log('Image 1 loaded:', firstImageUrl); // Debugging line
        img2.src = secondImageUrl;
      };

      img2.onload = () => {
        console.log('Image 2 loaded:', secondImageUrl); // Debugging line
        handleImageLoad();
      };

      img1.onerror = () => {
        console.error('Error loading image 1:', firstImageUrl);
      };

      img2.onerror = () => {
        console.error('Error loading image 2:', secondImageUrl);
      };

      img1.src = firstImageUrl;
    };

    // Automatically blend images every 5 seconds
    const interval = setInterval(blendImages, 5000);

    return () => clearInterval(interval);
  }, [loading, images]);

  return (
    <div className='bg-white h-screen p-1'>
        <h1 className='font-mono '>m a e l s t r o m</h1>
      <canvas id="canvas" width="500" height="800"></canvas>
      {loading && <p className=''>Loading images...</p>}
      {!loading && images.length < 2 && <p>Not enough images to blend</p>}
    </div>
  );
};

export default Theatre;