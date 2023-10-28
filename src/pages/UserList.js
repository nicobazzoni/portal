import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ChatModal from "./ChatModal";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const UserList = ({userId,}) => {   
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = auth;
  const profileId = userId?.split("@")[0];

  useEffect(() => {
    const getUsersData = async () => {
      setLoading(true);
      const usersRef = collection(db, "users");
      const first = query(usersRef, orderBy("displayName"), limit(4));
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
    <div>
      <h2>User List</h2>
      <input
        type="text"
        placeholder="Search users"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {filteredUsers.map((user) => (
            <li className="no-bullet"
              key={user.id}
              onClick={() => handleUserClick(user)}
              style={{ cursor: "pointer", color: "blue" }}
            >
               <Link
              to={`/profile/${profileId}`}
              className="text-blue-500 no-underline hover:lime-300"
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
