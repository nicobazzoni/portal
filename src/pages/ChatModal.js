import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  
} from "firebase/firestore";
import { db, auth } from "../firebase";

const ChatModal = ({ recipientName, recipientID }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesRef = collection(db, "messages");
  const currentUser = auth.currentUser;
  const [recipientIDState, setRecipientID] = useState(recipientID); // Initialize with the recipientID prop
 // Use setRecipientID as a state setter function

  useEffect(() => {
    console.log("Recipient ID State:", recipientIDState); // Debugging: Log recipientIDState
    if (!recipientIDState) {
      // Set the recipient ID here based on your app's logic (e.g., user selection)
      setRecipientID(recipientID);
      // Set the recipient's name
    }
  
    const queryMessages = query(
      messagesRef,
      where("recipientID", "in", [recipientID, auth.currentUser.uid]), // Filter messages for both sender and recipient
      orderBy("createdAt", "asc")
    );
  
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messages);
    });
  
    console.log("recipientName:", recipientName);
  
    return () => unsubscribe();
  }, [recipientIDState]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage.trim() === "") return;

    console.log("recipientName before addDoc:", recipientName);

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      sender: auth.currentUser.displayName,
      recipientID: recipientIDState, // Use recipientIDState here
      recipientName: recipientName,
    });

    setNewMessage("");
  };

  return (
 
    <div className="chat-app text-white">
      <div className="header">
        <h1 className="bg-gray-600 rounded-md p-1 font-bold">Chat with {recipientName}</h1>
      </div>
      <div className="messages text-white">
        {messages.map((message) => (
          console.log("recipientName in messages.map:", message.text),
          <div key={message.id} className="message">
            <span className="user">{message.sender}:</span> {message.text}
            
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="new-message-input font-poppins p-1 rounded-md border-none"
          placeholder="write here..."
        />
        <button type="submit" className="send-button p-2 m-2 rounded-md border-none">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatModal;
