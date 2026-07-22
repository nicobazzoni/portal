import React, { useCallback, useEffect, useState } from "react";
import { db, storage, auth } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  doc,
  getDoc,
  setDoc,
  query,
  onSnapshot,
  where,
  collection,
  orderBy,
} from "firebase/firestore";
import { useParams, Link, useNavigate } from "react-router-dom";
import FullscreenImage from "../components/FullScreenImage";
import { deleteImage } from "../utils/imageApi";
import ObserveButton from "../components/ObserveButton";

const UserProfile = () => {
  const [profile, setProfile] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const { id } = useParams(); // Get user ID from URL
const navigate = useNavigate();
  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      const publicSnapshot = await getDoc(doc(db, "publicProfiles", id));

      if (publicSnapshot.exists()) {
        setProfile(publicSnapshot.data());
      } else if (auth.currentUser?.uid === id) {
        const privateSnapshot = await getDoc(doc(db, "users", id));
        const fallbackProfile = {
          displayName:
            auth.currentUser.displayName ||
            privateSnapshot.data()?.displayName ||
            "Anonymous",
          bio: "",
        };
        try {
          fallbackProfile.profilePicURL = await getDownloadURL(
            ref(storage, `profile_pics/${id}`)
          );
        } catch {
          // A profile picture is optional.
        }
        try {
          await setDoc(doc(db, "publicProfiles", id), fallbackProfile, { merge: true });
        } catch (migrationError) {
          console.info("Public profile migration will complete after rules are deployed.");
        }
        setProfile(fallbackProfile);
      } else {
        // Compatibility with the currently deployed, pre-migration data model.
        try {
          const profilePicURL = await getDownloadURL(
            ref(storage, `profile_pics/${id}`)
          );
          setProfile({ profilePicURL });
        } catch {
          setProfile({});
        }
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
      setProfile({});
    }
  }, [id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    console.log("Profile ID from useParams:", id);
  }, [id]);

  // Fetch images (moods) associated with the user
  useEffect(() => {
    const imagesQuery = query(
      collection(db, "images"),
      where("userId", "==", id),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(imagesQuery, (snapshot) => {
      const fetchedImages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(fetchedImages);
      if (fetchedImages[0]?.displayName) {
        setProfile((currentProfile) =>
          currentProfile.displayName
            ? currentProfile
            : {
                ...currentProfile,
                displayName: fetchedImages[0].displayName,
                bio: currentProfile.bio || "",
              }
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  // Handle Profile Changes
  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Profile Picture Change
  const handleProfilePicChange = async (e) => {
    if (!currentUser || currentUser.uid !== id) {
        console.log("Unauthorized to edit this profile");
        return;
    }

    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file)); // Show preview before upload

    // Upload to Firebase Storage
    const storageRef = ref(storage, `profile_pics/${id}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        null,
        (error) => {
            console.error("🔥 Error uploading profile picture:", error);
        },
        async () => {
            // ✅ Get the file URL after upload
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

            console.log("✅ Uploaded! File available at:", downloadUrl);

            // ✅ Update Firestore User Profile with new profilePicURL
            try {
                await setDoc(doc(db, "publicProfiles", id), { profilePicURL: downloadUrl }, { merge: true });
                setProfile((prev) => ({ ...prev, profilePicURL: downloadUrl }));
                console.log("✅ Profile picture URL updated in Firestore!");
            } catch (error) {
                console.error("🔥 Error updating Firestore user profile:", error);
            }
        }
    );
};
  // Handle Profile Update
  const handleProfileUpdate = async () => {
    if (currentUser && currentUser.uid === id) {
      if (!profile.displayName || !profile.bio) {
        console.error("Display name and bio are mandatory");
        return;
      }

      try {
        const publicProfile = {
          displayName: profile.displayName.trim().slice(0, 80),
          bio: profile.bio.trim().slice(0, 500),
          ...(profile.profilePicURL ? { profilePicURL: profile.profilePicURL } : {}),
        };
        await setDoc(doc(db, "publicProfiles", id), publicProfile, { merge: true });
        setIsEditMode(false); // Exit edit mode
        console.log("Profile updated!");
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    } else {
      console.log("Unauthorized to edit this profile");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!currentUser || currentUser.uid !== id) return;
    if (!window.confirm("Permanently delete this image and its comments?")) return;

    try {
      await deleteImage(imageId);
      setImages((currentImages) =>
        currentImages.filter((image) => image.id !== imageId)
      );
    } catch (error) {
      console.error("Error deleting image:", error);
      window.alert(error.message);
    }
  };

  return (
    <div className="container mx-auto overflow-y-auto no-scrollbar space-y-2 scroll-m-0 px-4 py-8 h-screen text-white">
      <div>
      <button className="btn btn-primary mb-4" onClick={() => navigate(-1)}>
                Back
            </button>

      </div>
      
      {(previewImage || profile.profilePicURL) && (
        <img
          src={previewImage || profile.profilePicURL}
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
          <h2 className="text-2xl font-bold mb-2">{profile.displayName}</h2>
          <p className="mb-4">{profile.bio}</p>
          {currentUser && currentUser.uid === id && (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </>
      )}

      <ObserveButton profileId={id} />

      <div className="mt-4">
        <h3 className="text-xl font-bold text-white mb-4">User's Images</h3>
        {loading ? (
          <p>Loading images...</p>
        ) : images && images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-4 overflow-y-auto">
            {images.map((image) => (
              <div key={image.id} className="p-2 border border-gray-700 rounded-lg bg-gray-800">
                <Link to={`/image/${image.id}`}>
                  <FullscreenImage
                    className="h-38 w-full object-cover rounded-sm cursor-pointer"
                    src={image.imageUrl}
                    alt={image.prompt || "No prompt available"}
                  />
                </Link>
                <p className="text-white text-sm italic mt-2 text-center">
                  {image.prompt || "No prompt available"}
                </p>
                <p className="text-white text-xs">
                  {image.timestamp?.toDate().toLocaleString() || "Unknown date"}
                </p>
                {currentUser?.uid === id && (
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    Delete image
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No images available for this user.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
