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
} from "firebase/firestore";

import { useParams } from 'react-router-dom';


const UserProfile = () => {
  const [profile, setProfile] = useState({});
  const currentUser = auth.currentUser;
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
const [previewImage, setPreviewImage] = useState(null);
  

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

  const handleEditClick = () => {
    // Check if the current user is authorized to edit this profile
    if (currentUser && currentUser.uid === id) {
      setIsEditMode(true);
    } else {
      // User is not authorized to edit this profile
      console.log("Unauthorized to edit this profile");
    }
  };

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
    <div className="container mx-auto px-4 py-8">
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
            className="w-full p-2 mb-4 border rounded text-white"
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
