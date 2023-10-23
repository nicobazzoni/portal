import React, { useEffect, useState } from 'react';

const ImageInfo = () => {
  const [mediaInfo, setMediaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMediaInfo = async () => {
    const url = 'https://all-media-downloader.p.rapidapi.com/rapid_download/download';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '90d9cad4aemsh0c2ae781060c8c2p1a0ee0jsna36176967a11',
            'X-RapidAPI-Host': 'all-media-downloader.p.rapidapi.com'
        },
        body: new URLSearchParams({
            url: 'https://www.instagram.com/p/Cl74nIHobdD/'
        })
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log('res', result);
    } catch (error) {
        console.error(error);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setMediaInfo(result);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Define a rate limit interval (e.g., 2 seconds)
    const rateLimitInterval = 2000; // 2 seconds

    // Use setTimeout to limit the rate of API requests
    const timerId = setTimeout(() => {
      fetchMediaInfo();
    }, rateLimitInterval);

    return () => clearTimeout(timerId); // Clear the timer on unmount
  }, []);

  const data = {
    data: {
      shortcode_media: {
        dimensions: {
          height: 1350,
          width: 1080,
        },
        display_resources: [
          {
            config_height: 800,
            config_width: 640,
            src: 'https://scontent-nrt1-2.cdninstagram.com/v/t51.2885-15/318475481_157870300295082_348604385961277025_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08&_nc_ht=scontent-nrt1-2.cdninstagram.com&_nc_cat=106&_nc_ohc=ncpGMDGRo80AX9hW378&edm=AP_V10EBAAAA&ccb=7-5&ig_cache_key=Mjk4OTIzMTc1NzA3MjY0MzkwNw%3D%3D.2-ccb7-5&oh=00_AfBwLyrGC3Ez0stjxvkcTCNborQ5tJPeoGzizdYGiaR8Bw&oe=653B7D7C&_nc_sid=2999b8',
          },
          {
            config_height: 937,
            config_width: 750,
            src: 'https://scontent-nrt1-2.cdninstagram.com/v/t51.2885-15/318475481_157870300295082_348604385961277025_n.jpg?stp=dst-jpg_e35_p750x750_sh0.08&_nc_ht=scontent-nrt1-2.cdninstagram.com&_nc_cat=106&_nc_ohc=ncpGMDGRo80AX9hW378&edm=AP_V10EBAAAA&ccb=7-5&ig_cache_key=Mjk4OTIzMTc1NzA3MjY0MzkwNw%3D%3D.2-ccb7-5&oh=00_AfCcDZbjyfgqNZag_zYXUOBN9w-dIcF7QO-lHkyF4lwqkg&oe=653B7D7C&_nc_sid=2999b8',
          },
          {
            config_height: 1350,
            config_width: 1080,
            src: 'https://scontent-nrt1-2.cdninstagram.com/v/t51.2885-15/318475481_157870300295082_348604385961277025_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=scontent-nrt1-2.cdninstagram.com&_nc_cat=106&_nc_ohc=ncpGMDGRo80AX9hW378&edm=AP_V10EBAAAA&ccb=7-5&ig_cache_key=Mjk4OTIzMTc1NzA3MjY0MzkwNw%3D%3D.2-ccb7-5&oh=00_AfBkmqM53cpuG5yoOw-Nezu2GNjJAEdvZ_WXNipan3t7VA&oe=653B7D7C&_nc_sid=2999b8',
          },
        ],
      },
    },
  };

  const imageUrl = data.data.shortcode_media.display_resources[2].src;

  return (
    <div className="bg-gray-100 p-4">
      <img src={imageUrl} alt="Instagram Image" className="mx-auto" />
    </div>
  );
};

export default ImageInfo;
