// /Users/nico/Desktop/apps/portal/src/components/Sidebar.js

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
    <div className="relative z-50">
      {/* Toggle Tab */}
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 -right-0 bg-transparent text-white p-2 rounded-r-md cursor-pointer shadow-lg ${
          isOpen ? "rotate-180" : "rotate-0"
        } transition-transform duration-300`}
        onClick={toggleSidebar}
      >
        {/* Icon or Text for Toggle */}
        {/* You can replace this with an icon from a library like FontAwesome or Heroicons */}
        {isOpen ? "<<" : "chat"}
      </div>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-20 left-0 h-full bg-gray-800 text-white shadow-lg transition-width duration-300 ${
          isOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {/* Optional: Overlay to close sidebar when clicking outside */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-25"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar Content */}
        <div className="p-4">
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
      </div>
    </div>
  );
};

export default Sidebar;