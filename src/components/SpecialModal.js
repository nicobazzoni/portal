import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const SpecialModal = ({ userId, onClose }) => {
  const [specialUsers, setSpecialUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [specialUsersInfo, setSpecialUsersInfo] = useState({});
  const [creatorsInfo, setCreatorsInfo] = useState({});

  useEffect(() => {
    const fetchSpecialUsers = async () => {
      const specialUsersRef = collection(db, `users/${userId}/specials`);
      const specialUsersSnapshot = await getDocs(specialUsersRef);
      const specialUserIds = specialUsersSnapshot.docs.map(doc => doc.id);
      setSpecialUsers(specialUserIds);

      // Fetch user information for special users
      const specialUsersInfo = {};
      for (const specialUserId of specialUserIds) {
        const userDoc = await getDoc(doc(db, 'users', specialUserId));
        if (userDoc.exists()) {
          specialUsersInfo[specialUserId] = userDoc.data().displayName;
        }
      }
      setSpecialUsersInfo(specialUsersInfo);
    };

    fetchSpecialUsers();
  }, [userId]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (specialUsers.length === 0) return;

      const imagesQuery = query(collection(db, 'images'), where('likes', 'array-contains-any', specialUsers));
      const imagesSnapshot = await getDocs(imagesQuery);

      const images = imagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'image'
      }));

      setActivities(images);

      // Fetch creator information
      const creatorsInfo = {};
      for (const image of images) {
        if (!creatorsInfo[image.userId]) {
          const creatorDoc = await getDoc(doc(db, 'users', image.userId));
          if (creatorDoc.exists()) {
            creatorsInfo[image.userId] = creatorDoc.data().displayName;
          }
        }
      }
      setCreatorsInfo(creatorsInfo);
    };

    fetchActivities();
  }, [specialUsers]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-3xl h-full max-h-full overflow-y-auto md:w-3/4 md:h-3/4 lg:w-1/2 lg:h-1/2">
        <button onClick={onClose} className="text-black border-none rounded-md absolute top-2 right-2">Close</button>
        <h2 className="text-2xl mb-4">Special People's Activities</h2>
        {activities.length === 0 ? (
          <p>No activities found.</p>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="mb-4">
              {activity.likes && activity.likes.map(likeUserId => (
                specialUsersInfo[likeUserId] && creatorsInfo[activity.userId] && (
                  <p className="text-sm font-bold" key={likeUserId}>
                    {specialUsersInfo[likeUserId]} liked <span className='text-rose-400'>{creatorsInfo[activity.userId]}'s </span> {activity.type}
                  </p>
                )
              ))}
              {activity.userId && creatorsInfo[activity.userId] && (
                <Link to={`/profile/${activity.userId}`} className="text-sm font-bold no-underline bg-slate-100 p-1 mx-auto items-center rounded-md">
                  {creatorsInfo[activity.userId]}
                </Link>
              )}
              {activity.imageUrl && (
                <Link to={`/profile/${activity.userId}`}>
                  <img src={activity.imageUrl} alt="Special" className=" rounded-full p-1 h-36 cursor-pointer" />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SpecialModal;