import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import ChatModal from "./ChatModal";
import MoodCarousel from "../components/Moods";
import Footer from "../components/Footer";

const Home = ({ setActive, user }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toastShown = useRef(false); // Track if the toast has been shown
  const [selectedChat, setSelectedChat] = useState(null);
 
  const [showChatModal, setShowChatModal] = useState(false);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowChatModal(true);
  };

  const closeChatModal = () => {
    setSelectedChat(null);
    setShowChatModal(false);
  };


  

  useEffect(() => {
    if (!user && !toastShown.current) {
      toast.info("Please sign in to create AI images.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      toastShown.current = true; // Set toastShown to true after showing the toast
    }
  }, [setActive, user]);

  return (
    <div className="relative">
   
      <Sidebar currentUser={user} onSelectChat={handleSelectChat} />
      {showChatModal && selectedChat && (
        <ChatModal
          senderName={user.displayName}
          senderID={user.uid}
          recipientName={selectedChat.name}
          recipientID={selectedChat.id}
          onClose={closeChatModal}
        />
      )}

      {/* Main Content */}
      <div
        className={`main-content p-4 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <MoodCarousel path="/moods" />
        <h1>Welcome to the Chat App</h1>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;