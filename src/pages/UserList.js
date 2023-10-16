import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Import your Firestore instance
import ChatModal from "./ChatModal"; // Import your ChatModal component
import { auth } from "../firebase";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
    const { currentUser } = auth;

  useEffect(() => {
    const getUsersData = async () => {
      setLoading(true);
      const usersRef = collection(db, "users"); // Replace "users" with your collection name
      const first = query(usersRef, orderBy("displayName"), limit(4)); // Sort by "displayName" or another field
      const docSnapshot = await getDocs(first);
      setUsers(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setCount(docSnapshot.size);
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
      setLoading(false);
    };

    getUsersData();
  }, []);

  const handleUserClick = (user) => {
    // Open the chat modal and pass the selected user's data
    setSelectedUser(user);
  };

  const closeChatModal = () => {
    // Close the chat modal when needed
    setSelectedUser(null);
  };

  return (
    <div>
      <h2>User List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              {user.displayName}
            </li>
          ))}
        </ul>
      )}

      {/* Render the chat modal if a user is selected */}
      {selectedUser && (
        <ChatModal
          currentUser={currentUser}
          selectedUser={selectedUser}
          onClose={closeChatModal}
        />
      )}
    </div>
  );
};

export default UserList;
