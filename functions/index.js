import { onRequest } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { initializeApp } from "firebase-admin/app";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import { defineSecret } from "firebase-functions/params";

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();
const storage = getStorage();

// Define secrets (if you're using Firebase Secrets Manager)
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

export const generateImageHttps = onRequest(
  {
    secrets: [OPENAI_API_KEY], // Add secrets here if using Firebase Secrets
  },
  async (req, res) => {
    // Set CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    try {
      // Extract request data
      const { prompt, userId } = req.body;

      if (!prompt || !userId) {
        return res.status(400).json({
          error: "Missing required fields: 'prompt' or 'userId'",
        });
      }

      console.log(`[generateImage] UserID: ${userId}, Prompt: "${prompt}"`);

      // Retrieve OpenAI API key
      const openaiApiKey =
        process.env.OPENAI_API_KEY || OPENAI_API_KEY.value();

      if (!openaiApiKey) {
        return res.status(500).json({
          error: "OpenAI API key is missing",
        });
      }

      // Call OpenAI API to generate image
      const openaiResponse = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            prompt,
            n: 1,
            size: "1024x1024",
          }),
        }
      );

      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API Error: ${openaiResponse.statusText}`);
      }

      const data = await openaiResponse.json();
      const imageUrl = data.data[0]?.url;

      if (!imageUrl) {
        throw new Error("Image generation failed, no URL received");
      }

      console.log("[generateImage] Generated Image URL:", imageUrl);

      // Fetch the generated image and upload to Firebase Storage
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch generated image from OpenAI");
      }

      const buffer = await response.buffer();
      const bucket = storage.bucket("mediaman-a8ba1.appspot.com");
      const fileName = `moods/${uuidv4()}.png`;
      const file = bucket.file(fileName);

      await file.save(buffer, {
        metadata: {
          contentType: "image/png",
        },
      });

      // Generate a public URL for the uploaded file
      const [publicUrl] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2500", // Adjust expiration as needed
      });

      console.log("[generateImage] Uploaded image to Storage:", publicUrl);

      // Retrieve user display name from Firestore
      const userDoc = await db.collection("users").doc(userId).get();
      const displayName = userDoc.exists
        ? userDoc.data()?.displayName || "Anonymous"
        : "Anonymous";

      console.log(`[generateImage] Retrieved Display Name: ${displayName}`);

      // Save metadata to Firestore
      await db.collection("images").add({
        userId,
        prompt,
        imageUrl: publicUrl, // Use Firebase Storage URL
        displayName,
        timestamp: new Date(),
      });

      // Send response
      res.status(200).json({ imageUrl: publicUrl });
    } catch (error) {
      console.error("[generateImage] Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);