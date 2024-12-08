import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const MessageRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const messagesRef = collection(db, `rooms/${roomId}/messages`);
  const { currentUser } = auth;

  useEffect(() => {
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    try {
      await addDoc(messagesRef, {
        text: msg,
        createdAt: serverTimestamp(),
        uid: currentUser?.uid,
        displayName: currentUser?.displayName || 'Anonymous',
      });
      setMsg('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.uid === currentUser?.uid ? 'sent' : 'received'}`}
          >
            <p className="name">{message.displayName}</p>
            <p className="text">{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMsg} className="message-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default MessageRoom;