import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

function MoodCarousel() {
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchMoods = async () => {
            try {
                const moodList = [];
                const usersSnapshot = await getDocs(collection(db, 'users'));
                usersSnapshot.forEach(doc => {
                    const userData = doc.data();
                    if (userData.mood) {
                        moodList.push({
                            moodUrl: userData.mood,
                            user: userData
                        });
                    }
                });
                setMoods(moodList);
                setLoading(false);
// ... inside the return
 

            } catch (error) {
                console.error("Error fetching moods:", error);
            }
        };

        fetchMoods();
    }, []);
    useEffect(() => {
        console.log(moods);
    }
    , [moods]);



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

    return (
   
        <OwlCarousel autoplay {...options}>
        {loading? <p>loading </p> : moods && moods.length > 0 ? (
           moods.map((item, index) => (
              <div className='' key={index}>
                 <img src={item.moodUrl} className='rounded-full' alt="Mood" />
                 <h2 className='text-white text-center'>{item.user.displayName}</h2>
              </div>
           ))
        ) : (
           <p>Loading...</p>
        )}
     </OwlCarousel>
    );
}

export default MoodCarousel;
