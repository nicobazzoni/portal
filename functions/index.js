import { onRequest } from "firebase-functions/v2/https";
import { FieldPath, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import { defineSecret } from "firebase-functions/params";
import { timingSafeEqual } from "node:crypto";

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();
const storage = getStorage();

// Define secrets (if you're using Firebase Secrets Manager)
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");
const ADMIN_MIGRATION_KEY = defineSecret("ADMIN_MIGRATION_KEY");
const MAX_PROMPT_LENGTH = 2000;
const DAILY_GENERATION_LIMIT = 20;
const ALLOWED_ORIGINS = new Set([
  "https://portl.life",
  "https://www.portl.life",
  "https://mediaman-a8ba1.web.app",
  "https://mediaman-a8ba1.firebaseapp.com",
  "http://localhost:3000",
  "http://localhost:5000",
]);

function setCorsHeaders(req, res) {
  const origin = req.get("origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

async function getAuthenticatedUser(req) {
  const authorization = req.get("authorization") || "";
  const match = authorization.match(/^Bearer (.+)$/);
  if (!match) {
    throw Object.assign(new Error("Authentication required"), { status: 401 });
  }

  try {
    return await getAuth().verifyIdToken(match[1]);
  } catch {
    throw Object.assign(new Error("Invalid or expired authentication token"), {
      status: 401,
    });
  }
}

async function consumeDailyGeneration(userId) {
  const day = new Date().toISOString().slice(0, 10);
  const quotaRef = db.collection("generationQuotas").doc(`${userId}_${day}`);

  await db.runTransaction(async (transaction) => {
    const quota = await transaction.get(quotaRef);
    const count = quota.exists ? quota.data().count || 0 : 0;
    if (count >= DAILY_GENERATION_LIMIT) {
      throw Object.assign(
        new Error(`Daily image limit of ${DAILY_GENERATION_LIMIT} reached`),
        { status: 429 }
      );
    }
    transaction.set(
      quotaRef,
      { userId, day, count: count + 1, updatedAt: new Date() },
      { merge: true }
    );
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function migrationKeyIsValid(req) {
  const supplied = req.get("x-migration-key") || "";
  const expected = ADMIN_MIGRATION_KEY.value() || "";
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  return suppliedBuffer.length === expectedBuffer.length
    && suppliedBuffer.length > 0
    && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

async function deleteOwnedDraft(draftId, userId) {
  if (!/^[A-Za-z0-9]{10,40}$/.test(draftId || "")) return;
  const draftRef = db.collection("imageDrafts").doc(draftId);
  const draftSnapshot = await draftRef.get();
  if (!draftSnapshot.exists || draftSnapshot.data().userId !== userId) return;

  const fileName = draftSnapshot.data().fileName;
  if (typeof fileName === "string" && fileName.startsWith("moods/")) {
    await storage.bucket("mediaman-a8ba1.appspot.com").file(fileName).delete({
      ignoreNotFound: true,
    });
  }
  await draftRef.delete();
}


export const generateImageHttps = onRequest(
  {
    secrets: [OPENAI_API_KEY],
  },
  async (req, res) => {
    setCorsHeaders(req, res);

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const decodedToken = await getAuthenticatedUser(req);
      const userId = decodedToken.uid;
      const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
      const previousDraftId =
        typeof req.body?.previousDraftId === "string" ? req.body.previousDraftId : "";

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }
      if (prompt.length > MAX_PROMPT_LENGTH) {
        return res.status(400).json({
          error: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer`,
        });
      }
      await consumeDailyGeneration(userId);
      const userDocPromise = db.collection("publicProfiles").doc(userId).get();

      console.log(`[generateImage] UserID: ${userId}, Prompt length: ${prompt.length}`);

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
            model: "gpt-image-1.5",
            prompt,
            n: 1,
            size: "1024x1024",
            output_format: "png",
            user: userId,
          }),
        }
      );

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error("[generateImage] OpenAI error response:", errorText);
        let errorMessage = errorText;

        try {
          const parsedError = JSON.parse(errorText);
          errorMessage =
            parsedError.error?.message ||
            parsedError.message ||
            errorText;
        } catch {
          // Keep the raw text if OpenAI did not return JSON.
        }

        console.error("[generateImage] OpenAI request failed:", errorMessage);
        throw Object.assign(new Error("Image generation provider rejected the request"), {
          status: 502,
        });
      }

      const data = await openaiResponse.json();
      const generatedImage = data.data?.[0];
      const temporaryImageUrl = generatedImage?.url;
      const base64Image = generatedImage?.b64_json;

      if (!temporaryImageUrl && !base64Image) {
        throw new Error("Image generation failed, no URL received");
      }

      console.log("[generateImage] Generated image received from OpenAI");

      let buffer;
      if (base64Image) {
        buffer = Buffer.from(base64Image, "base64");
      } else {
        // Older DALL·E responses can return a temporary URL instead of base64.
        const response = await fetch(temporaryImageUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch generated image from OpenAI");
        }
        buffer = await response.buffer();
      }

      const bucket = storage.bucket("mediaman-a8ba1.appspot.com");
      const fileName = `moods/${uuidv4()}.png`;
      const file = bucket.file(fileName);

      await file.save(buffer, {
        metadata: {
          contentType: "image/png",
          cacheControl: "public, max-age=31536000, immutable",
        },
      });

      // ✅ Generate permanent Firebase Storage URL
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

      console.log("[generateImage] Uploaded image to Storage:", publicUrl);

      // Retrieve user display name from Firestore
      const userDoc = await userDocPromise;
      const displayName = userDoc.exists
        ? userDoc.data()?.displayName || "Anonymous"
        : "Anonymous";

      console.log(`[generateImage] Retrieved Display Name: ${displayName}`);

      // Keep the generated image private from the feed until the user posts it.
      const draftRef = db.collection("imageDrafts").doc();
      try {
        await draftRef.set({
          userId,
          prompt,
          imageUrl: publicUrl,
          fileName,
          displayName,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          model: "gpt-image-1.5",
        });
      } catch (firestoreError) {
        await file.delete({ ignoreNotFound: true }).catch((cleanupError) => {
          console.error("[generateImage] Orphan cleanup failed:", cleanupError.message);
        });
        throw firestoreError;
      }

      if (previousDraftId && previousDraftId !== draftRef.id) {
        await deleteOwnedDraft(previousDraftId, userId).catch((cleanupError) => {
          console.error("[generateImage] Previous draft cleanup failed:", cleanupError.message);
        });
      }

      res.status(200).json({ imageUrl: publicUrl, draftId: draftRef.id });
    } catch (error) {
      console.error("[generateImage] Error:", error.message);
      const status = Number.isInteger(error.status) ? error.status : 500;
      res.status(status).json({
        error: status === 500 ? "Unable to generate image" : error.message,
      });
    }
  }
);

export const publishImageHttps = onRequest(async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decodedToken = await getAuthenticatedUser(req);
    const draftId = typeof req.body?.draftId === "string" ? req.body.draftId : "";
    if (!/^[A-Za-z0-9]{10,40}$/.test(draftId)) {
      return res.status(400).json({ error: "Invalid draft ID" });
    }

    const draftRef = db.collection("imageDrafts").doc(draftId);
    const imageRef = db.collection("images").doc();
    await db.runTransaction(async (transaction) => {
      const draftSnapshot = await transaction.get(draftRef);
      if (!draftSnapshot.exists) {
        throw Object.assign(new Error("Draft not found or already posted"), { status: 404 });
      }
      const draft = draftSnapshot.data();
      if (draft.userId !== decodedToken.uid) {
        throw Object.assign(new Error("You do not own this draft"), { status: 403 });
      }
      transaction.set(imageRef, {
        userId: draft.userId,
        prompt: draft.prompt,
        imageUrl: draft.imageUrl,
        displayName: draft.displayName,
        timestamp: new Date(),
        model: draft.model || "gpt-image-1.5",
        status: "ready",
        likes: {},
      });
      transaction.delete(draftRef);
    });

    return res.status(200).json({ imageId: imageRef.id, imageUrl: null });
  } catch (error) {
    console.error("[publishImage] Error:", error.message);
    const status = Number.isInteger(error.status) ? error.status : 500;
    return res.status(status).json({
      error: status === 500 ? "Unable to post image" : error.message,
    });
  }
});

export const deleteImageHttps = onRequest(async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const decodedToken = await getAuthenticatedUser(req);
    const imageId = typeof req.body?.imageId === "string" ? req.body.imageId : "";
    if (!/^[A-Za-z0-9]{10,40}$/.test(imageId)) {
      return res.status(400).json({ error: "Invalid image ID" });
    }

    const imageRef = db.collection("images").doc(imageId);
    const imageSnapshot = await imageRef.get();
    if (!imageSnapshot.exists) {
      return res.status(404).json({ error: "Image not found" });
    }
    if (imageSnapshot.data().userId !== decodedToken.uid) {
      return res.status(403).json({ error: "You do not own this image" });
    }

    const imageUrl = imageSnapshot.data().imageUrl;
    try {
      const url = new URL(imageUrl);
      const encodedPath = url.pathname.match(/\/o\/(.+)$/)?.[1];
      const filePath = encodedPath ? decodeURIComponent(encodedPath) : "";
      if (filePath.startsWith("moods/")) {
        await storage.bucket("mediaman-a8ba1.appspot.com").file(filePath).delete({
          ignoreNotFound: true,
        });
      }
    } catch (storageError) {
      console.error("[deleteImage] Storage cleanup failed:", storageError.message);
      throw Object.assign(new Error("Could not remove image file"), { status: 500 });
    }

    await db.recursiveDelete(imageRef);
    return res.status(200).json({ deleted: true });
  } catch (error) {
    console.error("[deleteImage] Error:", error.message);
    const status = Number.isInteger(error.status) ? error.status : 500;
    return res.status(status).json({
      error: status === 500 ? "Unable to delete image" : error.message,
    });
  }
});

// One-time, secret-protected migration for profiles created before publicProfiles.
// It intentionally copies only fields that are safe to display publicly.
export const migratePublicProfilesHttps = onRequest(
  {
    secrets: [ADMIN_MIGRATION_KEY],
    timeoutSeconds: 300,
  },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    if (!migrationKeyIsValid(req)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    try {
      let lastDocument = null;
      let scanned = 0;
      let migrated = 0;

      while (true) {
        let usersQuery = db.collection("users").orderBy(FieldPath.documentId()).limit(400);
        if (lastDocument) usersQuery = usersQuery.startAfter(lastDocument);
        const usersSnapshot = await usersQuery.get();
        if (usersSnapshot.empty) break;

        const publicRefs = usersSnapshot.docs.map((userDoc) =>
          db.collection("publicProfiles").doc(userDoc.id)
        );
        const existingProfiles = await db.getAll(...publicRefs);
        const batch = db.batch();

        usersSnapshot.docs.forEach((userDoc, index) => {
          if (existingProfiles[index].exists) return;
          const user = userDoc.data();
          const publicProfile = {
            displayName:
              typeof user.displayName === "string" && user.displayName.trim()
                ? user.displayName.trim().slice(0, 80)
                : "Anonymous",
            bio: typeof user.bio === "string" ? user.bio.trim().slice(0, 500) : "",
          };
          if (
            typeof user.profilePicURL === "string"
            && user.profilePicURL.startsWith("https://")
          ) {
            publicProfile.profilePicURL = user.profilePicURL;
          }
          batch.set(publicRefs[index], publicProfile);
          migrated += 1;
        });

        await batch.commit();
        scanned += usersSnapshot.size;
        lastDocument = usersSnapshot.docs.at(-1);
      }

      return res.status(200).json({ scanned, migrated });
    } catch (error) {
      console.error("[migratePublicProfiles] Error:", error.message);
      return res.status(500).json({ error: "Migration failed" });
    }
  }
);

export const serveImageMetadata = onRequest(async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  res.set("Content-Security-Policy", "default-src 'none'; img-src https:; style-src 'unsafe-inline'");
  res.set("X-Content-Type-Options", "nosniff");

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
    const rawImageUrl = imageData.imageUrl || "https://via.placeholder.com/300";
    const imageUrl = /^https:\/\//.test(rawImageUrl)
      ? escapeHtml(rawImageUrl)
      : "https://via.placeholder.com/300";
    const prompt = escapeHtml(imageData.prompt || "AI Generated Image");
    const displayName = escapeHtml(imageData.displayName || "Anonymous User");
    const safeImageId = escapeHtml(imageId);

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta property="og:title" content="${prompt}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="https://portl.life/image/${safeImageId}" />
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
