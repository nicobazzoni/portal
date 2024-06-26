import React, { useState } from 'react';
import { functions } from '../firebase'; // Adjust the path
import { httpsCallable } from 'firebase/functions';
import { auth } from '../firebase'; // Adjust the path
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';
import { TextareaAutosize } from '@mui/material';

function DalleGenerator() {
  const [imageUrl, setImageUrl] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // State for error messages
  const user = auth.currentUser;
  let userId;
  
  if (user) {
    userId = user.uid; // This is the unique ID for the logged-in user
  }

  console.log("userId", userId);

  const navigate = useNavigate();

  const generateImage = async () => {
    setLoading(true); // Start the loading process
    setErrorMessage(null); // Reset the error message
    try {
      if (!userId) {
        console.error("No user is logged in.");
        setErrorMessage("You must be logged in to generate images.");
        return;
      }
      // Calling the generateImageHttps cloud function
      const generateFunction = httpsCallable(functions, 'generateImageHttps'); 
      const result = await generateFunction({ prompt: inputValue, userId: userId }); // You need to provide the userId here
      console.log("Cloud function response:", result);
      const generatedImageUrl = result.data.imageUrl;
      const firebaseUrl = await saveImageToFirebase(generatedImageUrl);
      setImageUrl(firebaseUrl);
    } catch (error) {
      console.error("Error generating or uploading image:", error);
      if (error.message.includes("prompt violation")) {
        setErrorMessage("Your prompt violates the OpenAI usage policy. Please modify your prompt and try again.");
      } else {
        setErrorMessage("An error occurred while generating the image. Please try again later.");
      }
    } finally {
      setLoading(false); // Stop the loading process either after the image is generated or in case of an error
    }
  }

  const saveImageToFirebase = async (imageUrl) => {
    const response = await fetch('https://us-central1-mediaman-a8ba1.cloudfunctions.net/fetchAndUploadImage', { 
      method: 'POST', 
      body: JSON.stringify({ imageUrl: imageUrl, userId: userId }), // include userId
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const data = await response.json();
    const firebaseUrl = data.firebaseUrl;
    return firebaseUrl;
  }

  const handleBack = () => { 
    navigate(-1);
  };

  return (
    <div className='h-screen flex flex-col items-center justify-between p-4'>
      <h4 className='text-xs text-black mb-2'>Generate a Dalle AI image</h4>
      <div className='w-full flex justify-center mb-4'>
        <button className="btn btn-primary pt-2 pb-2 p-4" onClick={handleBack}>Back</button>
      </div>
      <div className='flex flex-col items-center'>
        {loading ? (
          <Spinner /> // Your loading spinner component
        ) : (
          imageUrl && <img src={imageUrl} alt="Generated" className='rounded-sm h-72 mt-2' /> // Display the generated image only if imageUrl exists
        )}
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>} 
      </div>
      <TextareaAutosize 
        type="text"
        value={inputValue || ''}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="A cute turtle blowing bubbles..."
        className='border border-gray-300 p-2 w-1/2 rounded-md mb-4'
      />
      <button className='rounded-full border p-1' onClick={generateImage}>Generate</button>
    </div>
  );
}

export default DalleGenerator;