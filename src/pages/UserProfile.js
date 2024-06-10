import React, { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useParams } from 'react-router-dom';
import ChatModal from "./ChatModal"; // Ensure correct import
import { Link } from "react-router-dom";
import { DashOutlined } from "@ant-design/icons";
const UserProfile = () => {
  const [profile, setProfile] = useState({});
  const currentUser = auth.currentUser;
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [recipientName, setRecipientName] = useState(null);
  const [recipientID, setRecipientID] = useState(null);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSpecial, setIsSpecial] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const userId = id;

  const [menuOpen, setMenuOpen] = useState(null);

  const toggleMenu = (imageId) => {
    setMenuOpen((prev) => (prev === imageId ? null : imageId));
  };
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setProfile(snapshot.data());
        } else {
          console.error("No user data found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }
    };

    fetchUserData();
  }, [id]);

  // Check if the user is special
  useEffect(() => {
    const checkIfSpecial = async () => {
      if (currentUser) {
        const specialRef = doc(db, `users/${currentUser.uid}/specials/${id}`);
        const docSnapshot = await getDoc(specialRef);
        setIsSpecial(docSnapshot.exists());
      }
    };

    checkIfSpecial();
  }, [id, currentUser]);

  // Fetch images
  useEffect(() => {
    const imagesQuery = query(
      collection(db, 'images'),
      where('userId', '==', userId),
      orderBy('uploadedAt')
    );

    const unsubscribe = onSnapshot(imagesQuery, (snapshot) => {
      const fetchedImages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(fetchedImages);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching images:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleDeleteImage = async (imageId, imageUserId) => {
    if (currentUser && currentUser.uid === imageUserId) {
      setDeleting(true);
      try {
        await deleteDoc(doc(db, 'images', imageId));
        setImages(images.filter(image => image.id !== imageId));
        setDeleting(false);
      } catch (error) {
        console.error('Error deleting image:', error);
        setDeleting(false);
      }
    } else {
      console.error('You are not authorized to delete this image.');
    }
  };

  const handleEditClick = () => {
    if (currentUser && currentUser.uid === id) {
      setIsEditMode(true);
    } else {
      console.log("Unauthorized to edit this profile");
    }
  };

  const handleMarkAsSpecial = async () => {
    if (currentUser && id) {
      const specialRef = doc(db, `users/${currentUser.uid}/specials/${id}`);
      await setDoc(specialRef, {
        markedAt: serverTimestamp(),
      });
      setIsSpecial(true);
      alert(`${profile.displayName} has been marked as special!`);
    }
  };

  const handleSendMessage = () => {
    const recipientInfo = {
      id: id,
      displayName: profile.displayName,
    };

    setShowChatModal(true);
    setRecipientInfo(recipientInfo);
    setRecipientName(profile.displayName);
    setRecipientID(id); // Pass the recipient's unique ID
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePicChange = (e) => {
    if (currentUser && currentUser.uid === id) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }

      const storageRef = ref(storage, "profile_pics/" + id);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.log(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setProfile((prev) => ({ ...prev, profilePicURL: downloadUrl }));

          if (currentUser) {
            currentUser
              .updateProfile({
                photoURL: downloadUrl,
              })
              .then(() => {
                console.log("Profile picture updated in Firebase Authentication");
              })
              .catch((error) => {
                console.error("Error updating profile picture in Firebase Authentication:", error);
              });
          }
        }
      );
    } else {
      console.log("Unauthorized to edit this profile");
    }
  };

  const handleProfileUpdate = async () => {
    if (currentUser && currentUser.uid === id) {
      if (!profile.displayName || !profile.bio) {
        console.error("Display name and bio are mandatory");
        return;
      }

      try {
        await setDoc(doc(db, "users", id), profile, { merge: true });
        setIsEditMode(false);
        console.log("Profile updated or created!");
      } catch (error) {
        console.error("Error updating or creating profile in Firestore:", error);
      }
    } else {
      console.log("Unauthorized to edit this profile");
    }
  };

  if (loading) {
    return <div>Loading images...</div>;
  }

  return (
    <div className="container space-x-2  mx-auto overflow-y-auto no-scrollbar space-y-2  scroll-m-0 px-4 py-8 h-screen text-black">
      {profile.profilePicURL && (
        <img
          src={profile.profilePicURL}
          alt="Profile"
          className="rounded-full w-32 h-32 mx-auto mb-4 object-cover"
        />
      )}
      {isEditMode ? (
        <>
          <input
            type="file"
            onChange={handleProfilePicChange}
            className="mb-4 p-1"
          />
          <input
            type="text"
            name="displayName"
            value={profile.displayName || ""}
            onChange={handleProfileChange}
            placeholder="Display Name"
            className="w-full p-2 mb-4 border rounded"
          />
          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleProfileChange}
            placeholder="Bio"
            className="w-full p-2 mb-4 border rounded text-black"
          />
          <button
            onClick={handleProfileUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update Profile
          </button>
        </>
      ) : (
        <>
                   <h2 className="text-2xl font-bold mb-2">
            {profile.displayName}
          </h2>
          <p className="mb-4">{profile.bio}</p>
          {currentUser && currentUser.uid !== id && (
            <button
              onClick={handleMarkAsSpecial}
              className={`px-4 space-x-2 py-2 ${isSpecial ? 'bg-gray-500' : 'bg-green-500'} text-white rounded hover:bg-green-600`}
              disabled={isSpecial}
            >
              {isSpecial ? 'Already Special' : 'Mark as Special'}
            </button>
          )}
          {currentUser && currentUser.uid === id && (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </>
      )}
      <button
        onClick={handleSendMessage}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 border-none mb-2"
      >
        Send Message
      </button>

      {showChatModal && recipientInfo && (
        <ChatModal
          recipientName={recipientName}
          recipientID={recipientID} // Pass the user's ID as the recipient's ID
          onClose={() => setShowChatModal(false)}
        />
      )}

<div>moods</div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 p-2 gap-4 overflow-y-auto">
      
        {images.map(image => (
           
          <div key={image.id} className='image-tile'>
            <img
              className='h-38 w-full object-cover mb-1 cursor-pointer'
              src={image.imageUrl}
              alt="Mood"
            />
            <div className="image-info">
            
              <p className='text-black text-xs'>
                {image.uploadedAt.toDate().toLocaleString()}
              </p>
              {currentUser && currentUser.uid === image.userId && (
                <div className="relative">
                  <button className="p-1 border-none rounded-md" onClick={() => toggleMenu(image.id)}> <DashOutlined /> </button>
                  {menuOpen === image.id && (
                    <div className="absolute right-0 bg-white shadow-md rounded-md">
                      <button onClick={() => handleDeleteImage(image.id, image.userId)} className=" border-none rounded-md block px-4 py-4 text-black">
                       x
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;