import React, { useState } from 'react';
import Sidebar from './Sidebar';

const ChatApp = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  return (
    <div className="chat-app">
      <Sidebar onSelectConversation={handleSelectConversation} />
      {selectedConversation ? (
        <ChatWindow conversationId={selectedConversation} />
      ) : (
        <p>Please select a conversation.</p>
      )}
    </div>
  );
};

export default ChatApp;