import React, { useState } from 'react';
import { functions } from '../firebase'; // Adjust the path
import { httpsCallable } from 'firebase/functions';
import { auth } from '../firebase'; // Adjust the path
import Spinner from './Spinner';



function DalleGenerator() {
    const [imageUrl, setImageUrl] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [ loading, setLoading ] = useState(false);
    const user = auth.currentUser;
    let userId;
if (user) {
    userId = user.uid; // This is the unique ID for the logged-in user
}

console.log("userId", userId);
    
const generateImage = async () => {
    setLoading(true); // Start the loading process
    try {
        if (!userId) {
            console.error("No user is logged in.");
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
    

    return (
        <div className='h-screen'>
            <input 
                type="text"
                value={inputValue || ''}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="A cute turtle blowing bubbles..."
                className='border-2 border-gray-300 p-2 w-1/2'
            />
            <div><button className='m-2 rounded-full border p-1' onClick={generateImage}>Generate</button></div>
              
            {loading ? 
                <Spinner />  // Your loading spinner component
                : 
                imageUrl && <img src={imageUrl} alt="Generated" /> // Display the generated image only if imageUrl exists
            }
        </div>
    );
}

export default DalleGenerator;
