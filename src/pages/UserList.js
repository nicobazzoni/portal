import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import brainIcon from "/Users/nico/Desktop/apps/portal/src/components/assets/Plogo.svg"
const UserList = () => {   
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getUsersData = async () => {
      setLoading(true);
      const usersRef = collection(db, "users");
      const first = query(usersRef, orderBy("displayName"), limit(50));
      const docSnapshot = await getDocs(first);
      setUsers(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
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