import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import { auth } from "../firebase";
import { Link } from "react-router-dom";

const UserList = ({userId,user}) => {   
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = auth;
  const profileId = user?.split("@")[0];
  console.log(profileId)
  console.log("All Users:", users);

  useEffect(() => {
    const getUsersData = async () => {
      setLoading(true);
      const usersRef = collection(db, "users");
      const first = query(usersRef, orderBy("displayName"), limit(50));
      const docSnapshot = await getDocs(first);
      setUsers(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setCount(docSnapshot.size);
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
      setLoading(false);
    };

    getUsersData();
   
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  
  };

  const closeChatModal = () => {
    setSelectedUser(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen">
      <h2  className="text-white mt-2">User List</h2>
      <input
        type="text"
        placeholder="Search users"
        value={searchQuery}
        onChange={handleSearchChange}
        className="p-2 m-2 w-full rounded-md"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="no-bullet">
          {filteredUsers.map((user) => (
            <li className="no-bullet   border-opacity-25 "
              key={user.id}
              onClick={() => handleUserClick(user)}
              style={{ cursor: "pointer", color: "blue", listStyleType: "none"  }}
            >
               <Link
              to={`/profile/${user.id}`}
              className="text-blue-500 no-bullet no-underline hover:lime-300"
            >
              {user.displayName}
            </Link>
            </li>
          ))}
        </ul>
      )}

  
    </div>
  );
};

export default UserList;
