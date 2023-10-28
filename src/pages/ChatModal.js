import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  getDocs,
  
} from "firebase/firestore";
import { db, auth } from "../firebase";

const ChatModal = ({ recipientName, recipientID }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesRef = collection(db, "messages");
  const currentUser = auth.currentUser;
  const [recipientIDState, setRecipientID] = useState(recipientID); // Initialize with the recipientID prop
 // Use setRecipientID as a state setter function


const allMessagesQuery = query(
  messagesRef,
  orderBy("createdAt", "asc")
);

useEffect(() => {
  // Define the query inside the useEffect
  const allMessagesQuery = query(
    messagesRef,
    orderBy("createdAt", "asc")
  );

  // Set up the onSnapshot listener inside the useEffect
  const unsubscribe = onSnapshot(allMessagesQuery, (snapshot) => {
    const allMessages = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(message => 
        (message.senderID === currentUser.uid && message.recipientID === recipientIDState) || 
        (message.recipientID === currentUser.uid && message.senderID === recipientIDState)
      )
      .sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;  // Make sure the createdAt field exists
        return a.createdAt.seconds - b.createdAt.seconds;
      });

    setMessages(allMessages);
  });

  // Return the cleanup function
  return () => unsubscribe();
}, [recipientIDState, currentUser.uid]);


const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage.trim() === "") return;

    console.log("recipientName before addDoc:", recipientName);

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      sender: auth.currentUser.displayName,
      senderID: auth.currentUser.uid, // Save the sender's UID
      recipientID: recipientIDState,
      recipientName: recipientName,
    });
    

    setNewMessage("");
  };

  useEffect(() => {
    setRecipientID(recipientID);
  }, [recipientID]);
  

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
