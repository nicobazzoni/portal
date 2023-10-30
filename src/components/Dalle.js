import React, { useState } from 'react';
import { functions } from '../firebase'; // Adjust the path
import { httpsCallable } from 'firebase/functions';
import { auth } from '../firebase'; // Adjust the path

function DalleGenerator() {
    const [imageUrl, setImageUrl] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const user = auth.currentUser;
    let userId;
if (user) {
    userId = user.uid; // This is the unique ID for the logged-in user
}

console.log("userId", userId);
    
    const generateImage = async () => {
        try { if (!userId) {
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
            />
            <button onClick={generateImage}>Generate</button>
            {imageUrl && <img className='h-48 ' src={imageUrl} alt="Generated by DALL·E" />}
        </div>
    );
}

export default DalleGenerator;
