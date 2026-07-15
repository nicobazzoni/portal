import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { Link } from "react-router-dom";
import brainIcon from "../components/assets/Plogo.svg"
const UserList = () => {   
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getUsersData = async () => {
      setLoading(true);
      try {
        const publicProfilesQuery = query(
          collection(db, "publicProfiles"),
          orderBy("displayName"),
          limit(50)
        );
        const imagesQuery = query(
          collection(db, "images"),
          orderBy("timestamp", "desc"),
          limit(500)
        );
        const [profilesSnapshot, imagesSnapshot] = await Promise.all([
          getDocs(publicProfilesQuery),
          getDocs(imagesQuery),
        ]);

        const peopleById = new Map();
        imagesSnapshot.docs.forEach((imageDoc) => {
          const image = imageDoc.data();
          if (!image.userId || peopleById.has(image.userId)) return;
          peopleById.set(image.userId, {
            id: image.userId,
            displayName: image.displayName || "Anonymous",
          });
        });
        profilesSnapshot.docs.forEach((profileDoc) => {
          peopleById.set(profileDoc.id, {
            ...peopleById.get(profileDoc.id),
            id: profileDoc.id,
            ...profileDoc.data(),
          });
        });

        const discoveredPeople = Array.from(peopleById.values())
          .sort((a, b) =>
            (a.displayName || "").localeCompare(b.displayName || "")
          )
          .slice(0, 50);

        const peopleWithAvatars = await Promise.all(
          discoveredPeople.map(async (person) => {
            if (person.profilePicURL) return person;
            try {
              const profilePicURL = await getDownloadURL(
                ref(storage, `profile_pics/${person.id}`)
              );
              return { ...person, profilePicURL };
            } catch {
              return person;
            }
          })
        );
        setUsers(peopleWithAvatars);
      } catch (error) {
        console.error("Unable to load public profiles:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    getUsersData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-semibold mb-2 text-center">User List</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 mb-4 border border-gray-700 bg-gray-800 rounded-md text-white placeholder-gray-400"
      />
      
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredUsers.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="block text-center bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              <img
                src={user.profilePicURL || brainIcon}
                alt={user.displayName}
                className="w-20 h-20 object-cover rounded-full mx-auto"
              />
              <p className="mt-2 text-sm">{user.displayName || "Anonymous"}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
