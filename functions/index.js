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
        console.log("generateImageHttps function triggered with data:", req.body);
        const prompt = req.body.data && req.body.data.prompt;
        const userId = req.body.data && req.body.data.userId;

      



        if(!prompt || prompt.trim() === "") {
            console.error("Prompt is empty or undefined");
            return res.status(400).send("Prompt is required");
        }

        if (req.method === 'OPTIONS') {
            res.set('Access-Control-Allow-Methods', 'POST');
            res.set('Access-Control-Allow-Headers', 'Content-Type');
            res.set('Access-Control-Max-Age', '3600');
            return res.status(204).send('');
        }

        try {
            const response = await openai.images.generate({
                prompt: prompt,
                n: 1,
                response_format: 'url',
                size: '1024x1024',
            });
            console.log("Image generated successfully. Response:", response);
            return res.set('Access-Control-Allow-Origin', '*').json({
                data: {
                    imageUrl: response.data && response.data[0] && response.data[0].url
                }
            });
            
        } catch (error) {
            console.error("Error in generateImageHttps function:", error);
            return res.status(500).set('Access-Control-Allow-Origin', '*').send(error.message);
        }
    });
});

exports.fetchAndUploadImage = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, async () => {
        console.log("fetchAndUploadImage function triggered with request:", req.body);

        if (req.method !== "POST") {
            res.set('Access-Control-Allow-Origin', '*');
            return res.status(400).send('Please send a POST request');
        }

        const userId = req.body.userId; // Get user ID from the request body
        if (!userId) {
            return res.status(400).set('Access-Control-Allow-Origin', '*').send('User ID is required');
        }

        try {
            const response = await fetch(req.body.imageUrl);
            const blob = await response.buffer();
            console.log("Image fetched successfully.");

            const storage = new Storage();
            const bucketName = 'mediaman-a8ba1.appspot.com';
            const filename = `moods/${Date.now()}.png`;
            
            const file = storage.bucket(bucketName).file(filename);
            await file.save(blob, { contentType: 'image/png' });
            console.log("Image saved to Firebase Storage successfully.");

            const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filename)}?alt=media`;

            // Save firebaseUrl to the user's document in Firestore
            const userRef = db.collection('users').doc(userId);
            await userRef.update({ mood: firebaseUrl });
           

            return res.set('Access-Control-Allow-Origin', '*').json({ firebaseUrl: firebaseUrl });
        } catch (error) {
            console.error("Error in fetchAndUploadImage function:", error);
            return res.status(500).set('Access-Control-Allow-Origin', '*').send(error);
        }
        
    });
});

