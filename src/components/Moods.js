import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

function MoodCarousel() {
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [lastVisible, setLastVisible] = useState(null);
    useEffect(() => {
        const getUsersData = async () => {
          setLoading(true);
          const usersRef = collection(db, "users");
          const first = query(usersRef, orderBy("displayName"), limit(4));
          const docSnapshot = await getDocs(first);
          setUsers(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setCount(docSnapshot.size);
          setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
          setLoading(false);
        };
    
        getUsersData();
       
      }, []);
      console.log("All Users:", users);


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
        {users.map((user) => (
            <li className="no-bullet   border-opacity-25 "
              key={user.id}

              
            
              style={{ cursor: "pointer", color: "blue", listStyleType: "none"  }}
            >
               <Link
              to={`/profile/${user.id}`}
              className="text-blue-500 no-bullet no-underline hover:lime-300"
            >
              {user.displayName}
            </Link>
            <img src={user.mood} alt={user.displayName} className="rounded-full h-48 w-10 flex items-center justify-center" />
            </li>
          ))}
     </OwlCarousel>
    );
}

export default MoodCarousel;
