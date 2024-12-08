import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

const Sidebar = ({ onSelectChat }) => {
  const [conversations, setConversations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, "messages"),
        where("participants", "array-contains", currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatMap = new Map();

        snapshot.forEach((doc) => {
          const data = doc.data();
          const otherUserID =
            data.senderID === currentUser.uid ? data.recipientID : data.senderID;
          const otherUserName =
            data.senderID === currentUser.uid ? data.recipientName : data.senderName;

          if (!chatMap.has(otherUserID)) {
            chatMap.set(otherUserID, {
              id: otherUserID,
              name: otherUserName || "Unknown User",
              lastMessage: data.text,
              timestamp: data.createdAt?.seconds || 0,
            });
          }
        });

        const sortedChats = Array.from(chatMap.values()).sort(
          (a, b) => b.timestamp - a.timestamp
        );
        setConversations(sortedChats);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative z-50  bg-black bg-opacity-5 ">
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 bg-gray-600 bg-transparent text-white p-2 rounded-md z-50"
      >
        {isOpen ? "Close" : "Open"}
      </button>
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg transition-all duration-300 ${
          isOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {isOpen && (
          <div className="p-4 bg-black bg-opacity-75">
            <h2 className="text-xl font-bold mb-4">Your Chats</h2>
            <ul>
              {conversations.map((chat) => (
                <li
                  key={chat.id}
                  className="cursor-pointer p-2 bg-gray-700 rounded-md hover:bg-gray-600 mb-2"
                  onClick={() => onSelectChat(chat)}
                >
                  <p className="font-bold">{chat.name}</p>
                  <p className="text-sm text-gray-400 truncate">
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;