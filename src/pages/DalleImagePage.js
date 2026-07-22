import React, { useCallback, useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import DalleLike from "../components/DalleLike";
import DownloadImage from "../components/DownloadImage";

function DalleImagePage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invalidImages, setInvalidImages] = useState(new Set());
  const [lastDocument, setLastDocument] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [feedMode, setFeedMode] = useState("community");
  const userId = currentUser?.uid || null;

  useEffect(() => auth.onAuthStateChanged(setCurrentUser), []);

  const fetchImages = useCallback(async (cursor = null) => {
    const imagesRef = collection(db, "images");
    const constraints = [orderBy("timestamp", "desc")];
    if (cursor) constraints.push(startAfter(cursor));
    constraints.push(limit(20));

    const snapshot = await getDocs(query(imagesRef, ...constraints));
    const fetchedImages = snapshot.docs.map((imageDoc) => ({
      id: imageDoc.id,
      ...imageDoc.data(),
    }));
    setImages((current) => cursor ? [...current, ...fetchedImages] : fetchedImages);
    setLastDocument(snapshot.docs.at(-1) || null);
    setHasMore(snapshot.size === 20);
  }, []);

  useEffect(() => {
    fetchImages().catch((error) => {
      console.error("Error fetching images:", error);
    }).finally(() => {
      setLoading(false);
    });
  }, [fetchImages]);

  const handleLoadMore = async () => {
    if (!lastDocument || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchImages(lastDocument);
    } catch (error) {
      console.error("Error loading more images:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchObservingImages = async () => {
    if (!currentUser) {
      setImages([]);
      setHasMore(false);
      return;
    }

    const observingSnapshot = await getDocs(
      collection(db, "publicProfiles", currentUser.uid, "observing")
    );
    const creatorIds = observingSnapshot.docs.map((creatorDoc) => creatorDoc.id);
    if (creatorIds.length === 0) {
      setImages([]);
      setHasMore(false);
      return;
    }

    const chunks = [];
    for (let index = 0; index < creatorIds.length; index += 30) {
      chunks.push(creatorIds.slice(index, index + 30));
    }
    const snapshots = await Promise.all(
      chunks.map((creatorChunk) =>
        getDocs(query(
          collection(db, "images"),
          where("userId", "in", creatorChunk),
          orderBy("timestamp", "desc"),
          limit(50)
        ))
      )
    );
    const uniqueImages = new Map();
    snapshots.forEach((snapshot) => {
      snapshot.docs.forEach((imageDoc) => {
        uniqueImages.set(imageDoc.id, { id: imageDoc.id, ...imageDoc.data() });
      });
    });
    setImages(
      Array.from(uniqueImages.values())
        .sort((a, b) =>
          (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0)
        )
        .slice(0, 100)
    );
    setHasMore(false);
  };

  const changeFeed = async (nextMode) => {
    if (nextMode === feedMode) return;
    setFeedMode(nextMode);
    setLoading(true);
    setImages([]);
    try {
      if (nextMode === "observing") {
        await fetchObservingImages();
      } else {
        await fetchImages();
      }
    } catch (error) {
      console.error(`Unable to load ${nextMode} feed:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image loading errors
  const handleImageError = (imageId) => {
    console.error(`Image failed to load: ${imageId}`);
    setInvalidImages((prevInvalidImages) => new Set([...prevInvalidImages, imageId]));
  };

  // Lazy loading image component
  const LazyImage = ({ src, alt, onError }) => (
    <div style={{ minHeight: "150px", backgroundColor: "#333" }}>
      <img
        src={src}
        alt={alt}
        className="h-38 w-full object-cover mb-1 cursor-pointer"
        loading="lazy"
        onError={(e) => {
          e.target.src = "/fallback.png";
          onError();
        }}
      />
    </div>
  );

  if (loading) {
    return <div className="text-white text-center">Loading images...</div>;
  }

  // Handle likes (placeholder logic)
  const handleLike = async (imageId) => {
    console.log(`Liked image ID: ${imageId}`);
    // Implement like logic if needed
  };

  return (
    <>
      <h2 className="text-black text-center">Explore Portl</h2>
      <div className="flex justify-center gap-2 mb-4">
        <button
          className={`btn ${feedMode === "community" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => changeFeed("community")}
        >
          Community
        </button>
        <button
          className={`btn ${feedMode === "observing" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => changeFeed("observing")}
        >
          Observing
        </button>
      </div>
      {images.length === 0 && (
        <div className="text-black text-center py-8">
          {feedMode === "observing"
            ? currentUser
              ? "Observe creators to build your personal feed."
              : "Sign in to see your Observing feed."
            : "No images found."}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 gap-4 overflow-y-auto">
        {images
          .filter(
            (image) =>
              !invalidImages.has(image.id) &&
              image.imageUrl?.startsWith("http") &&
              image.prompt &&
              image.displayName &&
              image.timestamp
          )
          .map((image) => {
            const prompt = image.prompt || "No prompt available";
            const displayName = image.displayName || "Anonymous User";

            return (
              <div key={image.id} className="p-2 border  border-gray-700 rounded-lg bg-stone-800">
                <Link to={`/image/${image.id}`}>
                  <LazyImage src={image.imageUrl} alt={prompt} onError={() => handleImageError(image.id)} />
                </Link>
               
                <p className="text-white text-sm italic mt-2 text-center">{prompt}</p>
                <Link to={`/profile/${image.userId}`}>
                  <p className="text-white hover:bg-slate-700">{displayName}</p>
                </Link>
                <p className="text-white text-xs">
                  {image.timestamp?.toDate().toLocaleString() || "Unknown date"}
                </p>
                <div className=" relative items-center text-white flex space-between justify-between">
                <DalleLike
                  className="mt-2 text-white"
                  handleLike={() => handleLike(image.id)}
                  likes={image.likes || 0}
                  userId={userId}
                  imageId={image.id}
                />
                <DownloadImage imagePath={image.imageUrl} fileName={`PortlImage_${image.id}.png`} />
                </div>
              </div>
            );
          })}
      </div>
      {feedMode === "community" && hasMore && (
        <div className="text-center pb-6">
          <button className="btn btn-primary" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}

export default DalleImagePage;
