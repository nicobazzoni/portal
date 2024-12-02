import React, { useState, useEffect } from "react";

function ToastNotification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="text-2xl">
          <i className="fas fa-info-circle"></i>
        </div>
        <div>
          <p className="font-semibold">{message}</p>
          <button
            className="mt-2 text-sm underline hover:text-gray-200"
            onClick={onClose}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToastNotification;