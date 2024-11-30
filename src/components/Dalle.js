import React, { useState } from 'react';
import { functions, auth } from '../firebase'; // Ensure these paths are correct
import { httpsCallable } from 'firebase/functions';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';
import { TextareaAutosize } from '@mui/material';

function DalleGenerator() {
    const [imageUrl, setImageUrl] = useState(null); // For previewing the generated image
    const [uploadedUrl, setUploadedUrl] = useState(null); // For the uploaded Firebase image URL
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Get current user ID
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    // Log userId for debugging
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

        setLoading(true); // Start the loading spinner

        try {
            // Call Firebase Cloud Function
            const generateFunction = httpsCallable(functions, 'generateImageHttps');
            const result = await generateFunction({ prompt: inputValue, userId });
            console.log("Cloud Function Response:", result);

            const generatedImageUrl = result.data.imageUrl;

            if (!generatedImageUrl) {
                throw new Error("No image URL returned from the cloud function.");
            }

            // Show the preview of the generated image
            setImageUrl(generatedImageUrl);

            // Automatically save to Firebase after preview
            const firebaseUrl = await saveImageToFirebase(generatedImageUrl);
            setUploadedUrl(firebaseUrl); // Store the uploaded URL for further actions or display
        } catch (error) {
            console.error("Error generating image:", error);
            alert(`Error generating image: ${error.message}`);
        } finally {
            setLoading(false); // Stop the loading spinner
        }
    };

    // Save image to Firebase function
    const saveImageToFirebase = async (imageUrl) => {
        try {
            const response = await fetch(
                'https://us-central1-mediaman-a8ba1.cloudfunctions.net/fetchAndUploadImage',
                {
                    method: 'POST',
                    body: JSON.stringify({ imageUrl, userId }),
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to upload image. Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Image uploaded to Firebase:", data);
            return data.firebaseUrl;
        } catch (error) {
            console.error("Error saving image to Firebase:", error);
            throw error;
        }
    };

    // Navigate Back
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="h-screen">
            <div>
                <button className="btn btn-primary pt-2 pb-2 m-2 p-4" onClick={handleBack}>
                    Back
                </button>
            </div>
            <h4 className="text-xs text-white">Generate a DALL·E AI Image</h4>
            <TextareaAutosize
                type="text"
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

            {loading && <Spinner />} {/* Display spinner during loading */}

            {/* Preview generated image */}
            {!loading && imageUrl && (
                <div className="mt-4">
                    <h4 className="text-white">Preview Generated Image:</h4>
                    <img src={imageUrl} alt="Generated" className="rounded-sm h-72" />
                </div>
            )}

            {/* Show uploaded Firebase URL */}
            {!loading && uploadedUrl && (
                <div className="mt-4">
                    <h4 className="text-white">Image Uploaded to Firebase:</h4>
                    <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        View Uploaded Image
                    </a>
                </div>
            )}
        </div>
    );
}

export default DalleGenerator;