import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

function MoodCarousel({ active, setActive, user, handleLogout}) {
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [lastVisible, setLastVisible] = useState(null);
    
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();
    const [refreshKey, setRefreshKey] = useState(0);

    const [refreshCount, setRefreshCount] = useState(0);


    useEffect(() => {
  setRefresh(!refresh);
  console.log("Component mounted/updated");
}, []);


const handleRefresh = () => {
  setRefreshCount(prevCount => prevCount + 1);
};

    
useEffect(() => {
  const usersRef = collection(db, "users");
  const first = query(usersRef, orderBy("mood"), limit(4));

  // This sets up the real-time listener
  const unsubscribe = onSnapshot(first, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
      }));
      setUsers(usersList);
      setLoading(false);
  }, (error) => {
      console.error("Error fetching real-time data:", error);
  });

  // Cleanup function to unsubscribe from the listener when component unmounts
  return () => unsubscribe();
}, [refreshCount]);
     


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
        },
        autoplayTimeout: 5000,
        autoplaySpeed: 500,
        smartSpeed: 1000,
        dragEndSpeed: 3000,
    };


    const imgRef = useRef(null);

    const handleImageClick = () => {
        const image = imgRef.current;
        if (image) {
            if (image.requestFullscreen) {
                image.requestFullscreen();
            } else if (image.mozRequestFullScreen) { /* Firefox */
                image.mozRequestFullScreen();
            } else if (image.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                image.webkitRequestFullscreen();
            } else if (image.msRequestFullscreen) { /* IE/Edge */
                image.msRequestFullscreen();
            }
        }
    };

    return (

      <>
      
      <button onClick={handleRefresh} className="border-none rounded-full p-1  w-24 mx-auto mb-3 hover:bg-sky-400 font-poppins"> Moods</button>
        <OwlCarousel autoplay {...options}>
         
        {users?.map((user) => (
            <li className="no-bullet font-poppins bg-black rounded-full p-1   border-opacity-25 "
              key={user.id}

              
            
              style={{ cursor: "pointer", color: "blue", listStyleType: "none"  }}
            >
               <Link
              to={`/profile/${user.id}`}
              className="text-white font-poppins  p-2 z-10 shadow-sm  no-bullet bg-black rounded-md mt-4 no-underline hover:lime-300"
            >
              {user.displayName}
            </Link>
            <img src={user.mood} alt={user.displayName} onClick={() => {
        if (imgRef.current.requestFullscreen) {
            imgRef.current.requestFullscreen();
        }
    }} className="rounded-full h-76 mt-2 w-max flex items-center justify-center" />
            </li>
          ))}
     </OwlCarousel>
     
     </>
     
    );
}

export default MoodCarousel;
