import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Ensure proper initialization in firebase.js
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';
import { TextareaAutosize } from '@mui/material';

function DalleGenerator() {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [userId, setUserId] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("[Auth State] User signed in:", user.uid);
                setUserId(user.uid);
            } else {
                console.error("[Auth State] No user signed in.");
                setUserId(null);
            }
            setAuthChecked(true);
        });

        return () => unsubscribe();
    }, []);

    const generateImage = async (prompt) => {
        try {
            setErrorMessage('');
            if (!userId) {
                throw new Error("User not authenticated");
            }

            const user = auth.currentUser;
            const idToken = await user.getIdToken();

            const response = await fetch(
                "https://us-central1-mediaman-a8ba1.cloudfunctions.net/generateImageHttps",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({ prompt, userId }),
                }
            );

            if (!response.ok) {
                let errorResponse;
                try {
                    errorResponse = await response.json();
                } catch {
                    errorResponse = { error: "Unexpected error occurred" };
                }
                throw new Error(errorResponse.error || `Request failed with status ${response.status}`);
            }

            const data = await response.json();
            if (!data.imageUrl) {
                throw new Error("The response did not contain an image URL");
            }
            console.log("[Generate Image] Success:", data);
            return data;
        } catch (error) {
            console.error("[Generate Image] Error:", error.message);
            setErrorMessage(error.message);
            throw error;
        }
    };

    const handleGenerateClick = async () => {
        if (!inputValue.trim()) {
            setErrorMessage("Please enter a prompt to generate an image.");
            return;
        }

        setLoading(true);
        try {
            const data = await generateImage(inputValue);
            setImageUrl(data.imageUrl);
        } catch (error) {
            // Error already handled in generateImage
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen p-4 bg-gray-900 text-white">
            <button className="btn btn-primary mb-4" onClick={() => navigate(-1)}>
                Back
            </button>
            <h4 className="text-lg font-semibold mb-2">Generate a DALL·E AI Image</h4>
            <TextareaAutosize
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="A cute turtle blowing bubbles..."
                className="w-full max-w-lg p-2 mb-4 border border-gray-300 rounded-md"
            />
            <div>
                <button
                    className="btn btn-success px-4 py-2 rounded-lg disabled:opacity-50"
                    onClick={handleGenerateClick}
                    disabled={loading || !authChecked || !userId || !inputValue.trim()}
                >
                    {loading ? "Generating..." : "Generate"}
                </button>
            </div>
            {errorMessage && (
                <div className="mt-4 text-red-600 bg-red-100 p-2 rounded-md">
                    <p>Error: {errorMessage}</p>
                </div>
            )}
            {loading && <Spinner />}
            {!loading && imageUrl && (
                <div className="mt-4">
                    <h4 className="font-medium">Preview Generated Image:</h4>
                    <img src={imageUrl} alt="Generated" className="rounded-md mt-2 h-72" />
                </div>
            )}
        </div>
    );
}

export default DalleGenerator;