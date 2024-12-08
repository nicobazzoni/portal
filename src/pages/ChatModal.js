import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const ChatModal = ({
  senderName,
  senderID,
  recipientName,
  recipientID,
  onClose,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!senderID || !recipientID) {
      console.error(
        "Missing senderID or recipientID. Cannot run Firestore query."
      );
      return;
    }

    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", senderID),
      orderBy("createdAt", "desc") // Order by createdAt in descending order
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filteredMessages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (msg) =>
            msg.participants.includes(senderID) &&
            msg.participants.includes(recipientID)
        );
      setMessages(filteredMessages);
    });

    return () => unsubscribe();
  }, [senderID, recipientID]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!senderID || !recipientID) {
      console.error("Cannot send message without senderID or recipientID.");
      return;
    }

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      senderName,
      senderID,
      recipientName,
      recipientID,
      participants: [senderID, recipientID],
    });

    setNewMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Chat with {recipientName}</h2>

        {/* Messages */}
        <div className="h-64 overflow-y-auto mb-4 bg-gray-100 p-2 rounded-md">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <strong>{msg.senderID === senderID ? "You" : recipientName}:</strong>{" "}
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Box */}
        <form
          onSubmit={handleSendMessage}
          className="flex space-x-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow border p-2 rounded-md"
            placeholder="Type a message"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;