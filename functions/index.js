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
    secrets: [OPENAI_API_KEY],
  },
  async (req, res) => {
    // Set CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    try {
      const { prompt, userId } = req.body;

      if (!prompt || !userId) {
        return res.status(400).json({ error: "Missing 'prompt' or 'userId'" });
      }

      console.log(`[generateImage] UserID: ${userId}, Prompt: "${prompt}"`);

      // Retrieve OpenAI API key
      const openaiApiKey =
        process.env.OPENAI_API_KEY || OPENAI_API_KEY.value();

      if (!openaiApiKey) {
        return res.status(500).json({ error: "OpenAI API key is missing" });
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

      // ✅ Generate permanent Firebase Storage URL
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

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
        imageUrl: publicUrl, // ✅ Use permanent public URL
        displayName,
        timestamp: new Date(),
      });

      res.status(200).json({ imageUrl: publicUrl });
    } catch (error) {
      console.error("[generateImage] Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

export const serveImageMetadata = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");

  const imageId = req.path.split("/").pop(); // Extract ID from URL
  if (!imageId) {
    return res.status(400).send("Invalid request: No image ID provided.");
  }

  try {
    const docRef = db.collection("images").doc(imageId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).send("Image not found");
    }

    const imageData = docSnap.data();
    const imageUrl = imageData.imageUrl || "https://via.placeholder.com/300";
    const prompt = imageData.prompt || "AI Generated Image";
    const displayName = imageData.displayName || "Anonymous User";

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta property="og:title" content="${prompt}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="https://portl.life/image/${imageId}" />
          <meta property="og:type" content="website" />
          <meta property="og:description" content="Created by ${displayName} on Portl" />
        </head>
        <body>
          <h1>${prompt}</h1>
          <img src="${imageUrl}" alt="${prompt}" style="max-width:100%;" />
        </body>
      </html>
    `);
  } catch (error) {
    console.error("[serveImageMetadata] Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});