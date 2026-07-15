import { auth } from "../firebase";

const projectId = "mediaman-a8ba1";
const region = "us-central1";

function getFunctionUrl(functionName) {
  if (process.env.REACT_APP_USE_FIREBASE_EMULATORS === "true") {
    return `http://127.0.0.1:5001/${projectId}/${region}/${functionName}`;
  }
  return `https://${region}-${projectId}.cloudfunctions.net/${functionName}`;
}

export async function deleteImage(imageId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in before deleting an image.");

  const idToken = await user.getIdToken();
  let response;
  try {
    response = await fetch(getFunctionUrl("deleteImageHttps"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ imageId }),
    });
  } catch {
    throw new Error(
      process.env.REACT_APP_USE_FIREBASE_EMULATORS === "true"
        ? "The Firebase Functions emulator is not running on port 5001."
        : "The delete function is unavailable. Deploy deleteImageHttps and try again."
    );
  }

  let result = {};
  try {
    result = await response.json();
  } catch {
    // A proxy or undeployed function may return a non-JSON error page.
  }
  if (!response.ok) {
    throw new Error(result.error || `Delete failed with status ${response.status}.`);
  }
  return result;
}
