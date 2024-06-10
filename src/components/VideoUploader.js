import React, { useState, useRef } from "react";
import { storage, db, auth } from "../firebase"; // Adjust the path as needed
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "tailwindcss/tailwind.css";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique identifiers

const VideoUploader = () => {
  const [user] = useAuthState(auth);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const options = { mimeType: "video/webm;codecs=vp9" };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setVideoBlob(event.data);
          setPreviewURL(URL.createObjectURL(event.data)); // Create a preview URL
          console.log("Data available:", event.data);
        }
      };
      mediaRecorderRef.current.start();
      setRecording(true);
      console.log("Recording started");

      setTimeout(() => {
        handleStopRecording();
      }, 15000); // Stop recording after 15 seconds
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      setRecording(false);
      console.log("Recording stopped");
    }
  };

  const handleUpload = async () => {
    if (!videoBlob || !user) return;

    setUploading(true);
    const uniqueId = uuidv4(); // Generate a unique identifier
    const videoFile = new File([videoBlob], `${uniqueId}_video.webm`, { type: "video/webm" });
    const storageRef = ref(storage, `videos/${user.uid}/${videoFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Error uploading video:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Upload complete, download URL:", downloadURL);
        await addDoc(collection(db, "videos"), {
          url: downloadURL,
          userId: user.uid,
          timestamp: serverTimestamp(),
        });
        console.log("Video uploaded successfully:", downloadURL);
        setUploading(false);
        setVideoBlob(null); // Reset the videoBlob after upload
        setPreviewURL(null); // Reset the preview URL after upload
      }
    );
  };

  if (!user) {
    return <p>Please sign in to upload videos.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {previewURL ? (
        <video
          src={previewURL}
          controls
          className="mb-4 w-full max-w-lg rounded-lg shadow-lg"
        ></video>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          className="mb-4 w-full max-w-lg rounded-lg shadow-lg"
        ></video>
      )}
      <div className="flex space-x-4">
        {recording ? (
          <button
            onClick={handleStopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop Recording
          </button>
        ) : (
          <button
            onClick={handleStartRecording}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Recording
          </button>
        )}
        <button
          onClick={handleUpload}
          disabled={!videoBlob || uploading}
          className={`px-4 py-2 ${uploading ? "bg-gray-500" : "bg-green-500"} text-white rounded hover:bg-green-600`}
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </div>
    </div>
  );
};

export default VideoUploader;