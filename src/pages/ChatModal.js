import React, { useState, useEffect } from "react";
import { db } from "../firebase";

const ChatModal = ({ chatRoomId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Set up a Firebase listener to fetch and display messages in real-time
    const unsubscribe = db
      .collection("chatRooms")
      .doc(chatRoomId)
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const messageData = [];
        snapshot.forEach((doc) => {
          const message = doc.data();
          messageData.push(message);
        });
        setMessages(messageData);
      });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, [chatRoomId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Create a new message document and add it to the chat room
    await db.collection("chatRooms").doc(chatRoomId).collection("messages").add({
      sender: currentUser.uid,
      message: newMessage,
      timestamp: new Date(),
    });

    // Clear the input field after sending the message
    setNewMessage("");
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.timestamp}>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatModal;
