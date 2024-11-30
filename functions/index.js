const functions = require('firebase-functions');
const OpenAIApi = require('openai');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const { Storage } = require('@google-cloud/storage');
const cors = require('cors');

const corsHandler = cors({ origin: true });

const openaiApiKey = functions.config().openai.key;

const openai = new OpenAIApi({
    apiKey: openaiApiKey,
});

admin.initializeApp();
const db = admin.firestore();

exports.generateImageHttps = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, async () => {
        try {
            console.log("[generateImageHttps] Request received:", req.body);

            const { prompt, userId } = req.body.data;

            if (!prompt || !userId) {
                console.error("[generateImageHttps] Missing required fields.");
                return res.status(400).json({ error: "Prompt and userId are required." });
            }

            console.log(`[generateImageHttps] Generating image for prompt: "${prompt}"`);

            const openaiResponse = await openai.images.generate({
                prompt,
                n: 1,
                response_format: 'url',
                size: '1024x1024',
            });

            const imageUrl = openaiResponse.data?.[0]?.url;
            if (!imageUrl) {
                throw new Error("Failed to generate image: No URL returned from OpenAI.");
            }

            console.log("[generateImageHttps] Generated Image URL:", imageUrl);

            // Check if the image already exists in Firestore
            const existingImage = await db
                .collection('images')
                .where('imageUrl', '==', imageUrl)
                .get();

            if (!existingImage.empty) {
                console.log("[generateImageHttps] Duplicate image detected. Skipping save.");
                return res.status(200).json({ imageUrl, alreadySaved: true });
            }

            // Upload the image to Firebase Storage
            console.log("[generateImageHttps] Uploading image to Firebase Storage...");
            const bucketName = 'mediaman-a8ba1.appspot.com';
            const filename = `moods/${Date.now()}.png`;
            const storage = new Storage();
            const response = await fetch(imageUrl);
            const buffer = await response.buffer();
            const file = storage.bucket(bucketName).file(filename);

            await file.save(buffer, { contentType: 'image/png' });
            const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filename)}?alt=media`;

            console.log("[generateImageHttps] Image uploaded to Firebase Storage:", firebaseUrl);

            // Save metadata in Firestore
            console.log("[generateImageHttps] Saving metadata...");
            await db.collection('images').add({
                imageUrl: firebaseUrl,
                userId,
                prompt,
                uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log("[generateImageHttps] Metadata saved successfully.");
            return res.status(200).json({ imageUrl: firebaseUrl, alreadySaved: false });

        } catch (error) {
            console.error("[generateImageHttps] Error:", error.message);
            return res.status(500).json({ error: error.message });
        }
    });
});