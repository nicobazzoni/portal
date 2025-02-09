import { app } from "../firebase";  // Import your existing initialized Firebase app

// Function to generate a dynamic link
export const generateDynamicLink = async (imageId, imageUrl) => {
  const link = `https://portl.life/image/${imageId}`;

  const dynamicLinkParams = {
    dynamicLinkInfo: {
      domainUriPrefix: 'https://portl.page.link',  // Replace with your dynamic link prefix from Firebase
      link: link,
      socialMetaTagInfo: {
        socialTitle: 'Check out this image on Portl!',
        socialDescription: 'Generated with AI on Portl.',
        socialImageLink: imageUrl
      }
    }
  };

  try {
    const response = await fetch(
      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify(dynamicLinkParams),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();
    return data.shortLink;
  } catch (error) {
    console.error("Error generating dynamic link:", error);
    return null;
  }
};