import React, { useState } from 'react';
import OpenAI from "openai";
import { db } from '../firebase';
import { setDoc, doc } from "firebase/firestore";
import { useParams } from 'react-router-dom';


function ImageGenerator({ user }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [prompt, setPrompt] = useState('A cute baby sea otter');
    const [isLoading, setIsLoading] = useState(false);
   console.log(user)

 

  

    const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });

    const fetchImage = async () => {
        setIsLoading(true); // start loading
        try {
            // ... rest of your code
        } catch (error) {
            console.error("Error generating image:", error);
        }
        setIsLoading(false)
        try {
            const response = await openai.images.generate({
                prompt: prompt,
                n: 1,
                response_format: 'url',
                size: '1024x1024',
            });

            if (response.data && response.data.length > 0) {
                const moodImageUrl = response.data[0].url;
                setImageUrl(moodImageUrl);

                // Save moodImageUrl to the user's document in Firebase
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, { mood: moodImageUrl }, { merge: true });
            }
        } catch (error) {
            console.error("Error generating image:", error);
        }
    }

    return (
        <div>
            <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your mood with images"
                className='p-2 m-2 w-screen rounded-md focus-ring-0 focus:outline-none focus:ring-0 focus:border-transparent '
            />
            <div>
                <button className='border-none bg-lime-200 rounded-md p-2 m-2' onClick={fetchImage}>Generate Image</button>
            </div>
            <div className='h-screen mt-4'>
    {isLoading ? (
        <div className="spinner-border text-primary mt-5 spinner" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    ) : (
        imageUrl && <img className='h-96 w-max rounded-sm' src={imageUrl} alt="Generated by DALL·E" />
    )}
</div>
        </div>
    );
}

export default ImageGenerator;
