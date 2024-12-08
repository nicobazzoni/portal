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
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { useParams } from 'react-router-dom';
import Chat from "./ChatModal";
import FullscreenImage from "../components/FullScreenImage";

import { Link } from "react-router-dom";

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

  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages");
  const [userMoods, setUserMoods] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = id;

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


  useEffect(() => {
    fetchUserData();
  }, [id]);

  useEffect(() => {
    // Updated query to filter images by userId
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

    // Cleanup the listener when component is unmounted
    return () => unsubscribe();

}, [db, userId]);


  const handleEditClick = () => {
    if (currentUser && currentUser.uid === id) {
      setIsEditMode(true);
    } else {
      console.log("Unauthorized to edit this profile");
    }
  };

  // Function to handle "Send Message"
const handleSendMessage = () => {
  if (!profile || !profile.displayName) {
    console.error("Recipient information is missing.");
    return;
  }

  const recipientInfo = {
    id: id, // Recipient's unique ID
    displayName: profile.displayName,
  };

  setRecipientInfo(recipientInfo);
  setRecipientName(profile.displayName);
  setRecipientID(id); // Set the recipient's ID
  setShowChatModal(true); // Open the chat modal
};

// Render the Chat modal when showChatModal is true
{showChatModal && recipientInfo && (
  <Chat
    senderName={currentUser.displayName}
    senderID={currentUser.uid}
    recipientName={recipientName || recipientInfo.displayName}
    recipientID={recipientID || recipientInfo.id}
    recipientPhotoURL={profile.profilePicURL} // Optional: Profile picture of the recipient
    conversationID={`${currentUser.uid}_${recipientID}`} // Unique conversation ID
    onClose={() => setShowChatModal(false)} // Close the modal
  />
)}

  useEffect(() => {
    if (!recipientID) {
      console.log("Recipient ID is not set.");
      return;
    }

    const queryMessages = query(
      messagesRef,
      where("recipientID", "==", recipientID),
      orderBy("createdAt")
    );
    

 
  
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [recipientID]);








  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePicChange = (e) => {
    // Check if the current user is authorized to edit this profile
    if (currentUser && currentUser.uid === id) {
      const file = e.target.files[0];
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
  
      const storageRef = ref(storage, "profile_pics/" + id); // Use the 'id' from URL
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
                console.log(
                  "Profile picture updated in Firebase Authentication"
                );
              })
              .catch((error) => {
                console.error(
                  "Error updating profile picture in Firebase Authentication:",
                  error
                );
              });
          }
        }
      );
    } else {
      // User is not authorized to edit this profile
      console.log("Unauthorized to edit this profile");
    }
  };

  const handleProfileUpdate = async () => {
    // Check if the current user is authorized to edit this profile
    if (currentUser && currentUser.uid === id) {
      if (!profile.displayName || !profile.bio) {
        console.error("Display name and bio are mandatory");
        return;
      }
  
      try {
        await setDoc(doc(db, "users", id), profile, { merge: true }); // Use the 'id' from URL
        setIsEditMode(false); // Exit edit mode after updating
        console.log("Profile updated or created!");
      } catch (error) {
        console.error("Error updating or creating profile in Firestore:", error);
      }
    } else {
      // User is not authorized to edit this profile
      console.log("Unauthorized to edit this profile");
    }
  };
  


  

  return (
    <div className="container mx-auto overflow-y-auto no-scrollbar space-y-2  scroll-m-0 px-4 py-8 h-screen text-white">
    <Link to={`/messages/${userId}`}>Go to Room</Link>
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
  <Chat
    senderName={currentUser.displayName}
    senderID={currentUser.uid}
    recipientName={recipientName}
    recipientID={recipientID}
    recipientPhotoURL={profile.profilePicURL} // Optional: Pass recipient's profile pic
    conversationID={`${currentUser.uid}_${recipientID}`} // Unique conversation ID
    onClose={() => setShowChatModal(false)}
  />
)}

      <div>moods</div>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 p-2 gap-4 overflow-y-auto">
  {images && images.length > 0 ? (
    images.map((imageObj, index) => (
      <div className="flex-col" key={imageObj.id}>
        <FullscreenImage className="h-38 w-full object-cover rounded-sm " src={imageObj.imageUrl} alt={`Mood ${index + 1}`} />
      </div>
    ))
  ) : (
    <p>No moods available for this user.</p>
  )}
</div>

      

       

      
    </div>
  );
};

export default UserProfile;
