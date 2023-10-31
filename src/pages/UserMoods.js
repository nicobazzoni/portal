// UserMoods.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from 'react-router-dom';



function UserMoods({ userId }) {
    
    const [userMoods, setUserMoods] = useState([]);

    useEffect(() => {
        
        const fetchUserMoods = async () => {
            const moodsRef = collection(db, "users");
            const specificUserMoods = query(moodsRef, where("uid", "==", userId));
            
            const moodSnapshot = await getDocs(specificUserMoods);
            const moodsList = moodSnapshot.docs.map(doc => doc.data().mood);
            setUserMoods(moodsList);
            console.log(moodsList);
        };

        fetchUserMoods();
    }, [userId]);

    return (
        <div className="user-moods-container">
            {userMoods.map((mood, index) => (
                <img 
                    key={index} 
                    src={mood} 
                    alt={`Mood ${index}`} 
                    className="rounded-full h-76 mt-2 w-max" 
                />
            ))}
        </div>
    );
}

export default UserMoods;
