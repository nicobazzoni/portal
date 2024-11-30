const functions = require('firebase-functions');
const OpenAIApi = require('openai');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const { Storage } = require('@google-cloud/storage');
const cors = require('cors');

const corsHandler = cors({ origin: true });

const openaiApiKey = functions.config().openai.key;

const openai = new OpenAIApi({ apiKey: openaiApiKey });

admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

// Helper function to fetch and upload image
const fetchImageAndUpload = async (imageUrl, bucketName, filename) => {
    try {
        console.log("[fetchImageAndUpload] Fetching image from URL:", imageUrl);
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image. Status: ${response.status}`);
        }

        const blob = await response.buffer();
        const storage = new Storage();
        const file = storage.bucket(bucketName).file(filename);

        await file.save(blob, { contentType: 'image/png' });
        console.log("[fetchImageAndUpload] Image uploaded to Firebase Storage");

        return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filename)}?alt=media`;
    } catch (error) {
        console.error("[fetchImageAndUpload] Error:", error.message);
        throw error;
    }
};

// Cloud Function: Generate image using OpenAI and upload to Firebase Storage
exports.generateImageHttps = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, async () => {
        try {
            console.log("[generateImageHttps] Request received:", req.body);

            const prompt = req.body.data?.prompt;
            const userId = req.body.data?.userId;

            if (!prompt || typeof prompt !== 'string') {
                console.error("[generateImageHttps] Missing or invalid 'prompt'");
                return res.status(400).json({ error: "A valid 'prompt' is required" });
            }

            if (!userId || typeof userId !== 'string') {
                console.error("[generateImageHttps] Missing or invalid 'userId'");
                return res.status(400).json({ error: "A valid 'userId' is required" });
            }

            console.log(`[generateImageHttps] Generating image for prompt: "${prompt}"`);

            const openaiResponse = await openai.images.generate({
                prompt: prompt,
                n: 1,
                response_format: 'url',
                size: '1024x1024',
            });

            const imageUrl = openaiResponse.data?.[0]?.url;
            if (!imageUrl) {
                throw new Error("Failed to generate image: No URL returned");
            }

            console.log("[generateImageHttps] Image generated successfully:", imageUrl);

            const bucketName = 'mediaman-a8ba1.appspot.com';
            const filename = `moods/${Date.now()}.png`;
            const firebaseUrl = await fetchImageAndUpload(imageUrl, bucketName, filename);

            console.log("[generateImageHttps] Image uploaded to Firebase Storage. URL:", firebaseUrl);

            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                console.warn(`[generateImageHttps] User not found for userId: ${userId}`);
                return res.status(404).json({ error: "User not found" });
            }

            const displayName = userDoc.data().displayName;

            await db.collection('images').add({
                imageUrl: firebaseUrl,
                userId: userId,
                displayName: displayName,
                prompt: prompt,
                uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log("[generateImageHttps] Image metadata saved successfully");

            return res.set('Access-Control-Allow-Origin', '*').json({
                data: { imageUrl: firebaseUrl },
            });

        } catch (error) {
            console.error("[generateImageHttps] Error:", error.message);
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    });
});

// Cloud Function: Fetch image from URL and upload to Firebase Storage
exports.fetchAndUploadImage = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, async () => {
        try {
            console.log("[fetchAndUploadImage] Request received:", req.body);

            const { imageUrl, userId, prompt } = req.body;

            if (!imageUrl || !userId || !prompt) {
                console.error("[fetchAndUploadImage] Missing required fields");
                return res.status(400).json({ error: "Image URL, userId, and prompt are required" });
            }

            console.log("[fetchAndUploadImage] Fetching image...");

            const bucketName = 'mediaman-a8ba1.appspot.com';
            const filename = `moods/${Date.now()}.png`;
            const firebaseUrl = await fetchImageAndUpload(imageUrl, bucketName, filename);

            console.log("[fetchAndUploadImage] Image uploaded successfully:", firebaseUrl);

            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();

            const displayName = userDoc.exists ? userDoc.data().displayName : "Unknown User";

            await db.collection('images').add({
                imageUrl: firebaseUrl,
                userId: userId,
                displayName: displayName,
                prompt: prompt,
                uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log("[fetchAndUploadImage] Image metadata saved successfully");

            return res.set('Access-Control-Allow-Origin', '*').json({ firebaseUrl: firebaseUrl });
        } catch (error) {
            console.error("[fetchAndUploadImage] Error:", error.message);
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    });
});