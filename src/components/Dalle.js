import React, { useState } from 'react';
import { functions, auth } from '../firebase'; // Ensure these paths are correct
import { httpsCallable } from 'firebase/functions';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';
import { TextareaAutosize } from '@mui/material';

function DalleGenerator() {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState(''); // Add this to fix the error
    const navigate = useNavigate();

    // Get current user ID
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    console.log("Logged-in user ID:", userId);

    // Generate Image Function
    const generateImage = async () => {
        if (!inputValue.trim()) {
            alert("Please enter a prompt to generate an image.");
            return;
        }

        if (!userId) {
            console.error("No user is logged in. Cannot generate image.");
            return;
        }

        setLoading(true);

        try {
            console.log("Generating image...");
            const generateFunction = httpsCallable(functions, 'generateImageHttps');
            const result = await generateFunction({ prompt: inputValue, userId });

            if (result.data.alreadySaved) {
                console.log("Image already saved in the backend.");
            }

            const generatedImageUrl = result.data.imageUrl;
            if (!generatedImageUrl) {
                throw new Error("No image URL returned from the cloud function.");
            }

            // Show the preview of the generated image
            setImageUrl(generatedImageUrl);
        } catch (error) {
            console.error("Error generating image:", error.message);
            alert(`Error generating image: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen">
            <div>
                <button className="btn btn-primary pt-2 pb-2 m-2 p-4" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
            <h4 className="text-xs text-white">Generate a DALL·E AI Image</h4>
            <TextareaAutosize
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="A cute turtle blowing bubbles..."
                className="border-none border-gray-300 p-2 w-1/2 rounded-md"
            />
            <div>
                <button
                    className="m-2 rounded-full border p-1"
                    onClick={generateImage}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate"}
                </button>
            </div>

            {loading && <Spinner />}
            {!loading && imageUrl && (
                <div className="mt-4">
                    <h4 className="text-white">Preview Generated Image:</h4>
                    <img src={imageUrl} alt="Generated" className="rounded-sm h-72" />
                </div>
            )}
        </div>
    );
}

export default DalleGenerator;