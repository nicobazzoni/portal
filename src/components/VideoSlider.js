import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Adjust the path as needed
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'tailwindcss/tailwind.css';

const VideoSlider = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'videos'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedVideos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVideos(fetchedVideos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading videos...</p>;
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 text-center">Video Stories</h2>
      <Slider {...settings}>
        {videos.map((video) => (
          <div key={video.id} className="p-2">
            <div className="rounded-full overflow-hidden w-24 h-24 lg:w-48 lg:h-48 mx-auto">
              <video
                src={video.url}
                className="w-full h-full object-cover"
                controls
                autoPlay={true}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default VideoSlider;