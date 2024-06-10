import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import DalleLike from '../components/DalleLike';
import ShareButton from '../components/ShareButton';
import { InstagramEmbed } from 'react-social-media-embed';

function DalleImagePage({ active, setActive, handleLogout }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [selectedImageId, setSelectedImageId] = useState(null);
  const { id } = useParams();
  const user = auth.currentUser;
  
  let userId;
  if (user) {
    userId = user.uid; // This is the unique ID for the logged-in user
  }
  
  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'images'), orderBy('uploadedAt')));
      const fetchedImages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      setImages(fetchedImages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };
  
  const fetchLikesForImage = (imageId) => {
    const imageRef = doc(db, 'images', imageId);
  
    onSnapshot(imageRef, (snapshot) => {
      if (snapshot.exists()) {
        const imageLikes = snapshot.data().likes || [];
        // Update the specific image's likes
        setImages(prevImages =>
          prevImages.map(image =>
            image.id === imageId ? { ...image, likes: imageLikes } : image
          )
        );
      }
    });
  };
  
  useEffect(() => {
    fetchImages();
  }, []);
  
  // After setting images in fetchImages, loop through the images and call fetchLikesForImage for each image
  useEffect(() => {
    images.forEach(image => {
      fetchLikesForImage(image.id);
    });
  }, [images]);
  
  const handleLike = async (imageId) => {
    if (!userId || !imageId) return;
  
    try {
      const imageRef = doc(db, 'images', imageId);
      const imageSnapshot = await getDoc(imageRef);
      
      if (imageSnapshot.exists()) {
        const imageData = imageSnapshot.data();
        let imageLikes = imageData.likes || [];
  
        if (!Array.isArray(imageLikes)) {
          imageLikes = [imageLikes];
        }
  
        const updatedLikes = imageLikes.includes(userId)
          ? imageLikes.filter(id => id !== userId)
          : [...imageLikes, userId];
  
        await updateDoc(imageRef, { likes: updatedLikes, timestamp: serverTimestamp() });
        setLikes((prevLikes) => updatedLikes); // Update the state based on the modified likes
      } else {
        console.error('Image document does not exist.');
      }
    } catch (error) {
      console.error('Error updating likes:', error.message);
    }
  };
  
  const handleImageClick = (imageId) => {
    const image = document.getElementById(imageId);
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
      <h2 className='text-black text-center'>User Dalle AI images</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 p-2 gap-4 overflow-y-auto">
        {images.map(image => (
          <div key={image.id} className='group relative'>
            <img
              id={image.id}
              className='h-38 w-full object-cover mb-1 cursor-pointer'
              src={image.imageUrl}
              alt="Mood"
              onClick={() => handleImageClick(image.id)}
            />
            <DalleLike handleLike={handleLike} likes={image.likes} userId={userId} imageId={image.id} className='mt-1 bg-slate-300 cursor-pointer' />
            <Link to={`/profile/${image.userId}`} className='no-underline'>
              <p className='text-black hover:bg-slate-700'>{image.displayName}</p>
            </Link>
            {image.prompt && (
              <p className='text-black text-center'>{image.prompt}</p>
            )}
            <p className='hidden group-hover:block absolute bottom-0 left-0 mb-4 ml-4 p-2 bg-white bg-opacity-75 rounded text-black text-xs'>
              {image.uploadedAt.toDate().toLocaleString()}
            </p>
            <p className='text-black text-center'>{image.prompt}</p>
            
            
          </div>
        ))}
      </div>
    </>
  );
}

export default DalleImagePage;