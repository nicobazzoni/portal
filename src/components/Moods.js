import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

function MoodCarousel({ active, setActive, user, handleLogout}) {
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [lastVisible, setLastVisible] = useState(null);
    
    
    
    
    useEffect(() => {
        const getUsersData = async () => {
          setLoading(true);
          const usersRef = collection(db, "users");
          const first = query(usersRef, orderBy("mood"), limit(4));
          const docSnapshot = await getDocs(first);
          setUsers(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setCount(docSnapshot.size);
          setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
          setLoading(false);
        };
    
        getUsersData();
       
      }, []);
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
            setCount(snapshot.size);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching real-time data:", error);
        });
    
        // Cleanup function to unsubscribe from the listener when component unmounts
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
        },
        autoplayTimeout: 5000,
        autoplaySpeed: 500,
        smartSpeed: 1000,
        dragEndSpeed: 3000,
    };

    return (
   
        <OwlCarousel autoplay {...options}>
        {users.map((user) => (
            <li className="no-bullet font-poppins bg-white p-1   border-opacity-25 "
              key={user.id}

              
            
              style={{ cursor: "pointer", color: "blue", listStyleType: "none"  }}
            >
               <Link
              to={`/profile/${user.id}`}
              className="text-white font-poppins  p-2 z-10 shadow-sm  no-bullet bg-black rounded-md mt-4 no-underline hover:lime-300"
            >
              {user.displayName}
            </Link>
            <img src={user.mood} alt={user.displayName} className="rounded-full h-48 mt-2 flex items-center justify-center" />
            </li>
          ))}
     </OwlCarousel>
    );
}

export default MoodCarousel;
