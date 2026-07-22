import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getCountFromServer,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const ObserveButton = ({ profileId }) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isObserving, setIsObserving] = useState(false);
  const [observerCount, setObserverCount] = useState(0);
  const [observingCount, setObservingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const logFirebaseError = useCallback((label, error) => {
    console.error(label, {
      code: error?.code || "unknown",
      message: error?.message || String(error),
      profileId,
      currentUserId: auth.currentUser?.uid || null,
    });
  }, [profileId]);

  const refreshCounts = useCallback(async () => {
    if (!profileId) return;
    const [observers, observing] = await Promise.all([
      getCountFromServer(collection(db, "publicProfiles", profileId, "observers")),
      getCountFromServer(collection(db, "publicProfiles", profileId, "observing")),
    ]);
    setObserverCount(observers.data().count);
    setObservingCount(observing.data().count);
  }, [profileId]);

  useEffect(() => auth.onAuthStateChanged(setCurrentUser), []);

  useEffect(() => {
    refreshCounts().catch((error) =>
      logFirebaseError("Unable to load Observe counts", error)
    );
  }, [logFirebaseError, refreshCounts]);

  useEffect(() => {
    if (!currentUser || !profileId || currentUser.uid === profileId) {
      setIsObserving(false);
      return undefined;
    }
    return onSnapshot(
      doc(db, "publicProfiles", currentUser.uid, "observing", profileId),
      (snapshot) => setIsObserving(snapshot.exists()),
      (error) => logFirebaseError("Unable to load Observe status", error)
    );
  }, [currentUser, logFirebaseError, profileId]);

  const handleObserve = async () => {
    if (!currentUser) {
      window.location.assign("/auth");
      return;
    }
    if (currentUser.uid === profileId || loading) return;

    setLoading(true);
    const observingRef = doc(
      db,
      "publicProfiles",
      currentUser.uid,
      "observing",
      profileId
    );
    const observerRef = doc(
      db,
      "publicProfiles",
      profileId,
      "observers",
      currentUser.uid
    );

    try {
      if (isObserving) {
        const batch = writeBatch(db);
        batch.delete(observingRef);
        batch.delete(observerRef);
        await batch.commit();
        setIsObserving(false);
        setObserverCount((count) => Math.max(0, count - 1));
      } else {
        const batch = writeBatch(db);
        batch.set(observingRef, {
          creatorId: profileId,
          observerId: currentUser.uid,
          createdAt: serverTimestamp(),
        });
        batch.set(observerRef, {
          creatorId: profileId,
          observerId: currentUser.uid,
          createdAt: serverTimestamp(),
        });
        await batch.commit();
        setIsObserving(true);
        setObserverCount((count) => count + 1);
      }
    } catch (error) {
      logFirebaseError("Unable to update Observe status", error);
      window.alert(
        `Could not update Observe status (${error?.code || "unknown error"}).`
      );
      return;
    } finally {
      setLoading(false);
    }

    refreshCounts().catch((error) =>
      logFirebaseError("Observe updated, but counts could not refresh", error)
    );
  };

  return (
    <div className="my-4 flex flex-wrap items-center gap-3">
      {currentUser?.uid !== profileId && (
        <button
          type="button"
          className={`px-4 py-2 rounded-md font-semibold ${
            isObserving
              ? "bg-gray-200 text-black"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={handleObserve}
          disabled={loading}
        >
          {loading ? "Updating..." : isObserving ? "✓ Observing" : "+ Observe"}
        </button>
      )}
      <span>{observerCount} {observerCount === 1 ? "Observer" : "Observers"}</span>
      <span>Observing {observingCount}</span>
    </div>
  );
};

export default ObserveButton;
