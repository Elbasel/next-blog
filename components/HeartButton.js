import { doc, increment, writeBatch } from "firebase/firestore";
import React from "react";
import { auth, firestore } from "../lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";

export default function HeartButton({ postRef }) {
  const heartRef = doc(
    firestore,
    postRef.path + `/hearts/${auth.currentUser.uid}`
  );
  const [heartDoc] = useDocument(heartRef);

  const addHeart = async () => {
    const batch = writeBatch(firestore);
    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid: auth.currentUser.uid });

    await batch.commit();
  };

  const deleteHeart = async () => {
    const batch = writeBatch(firestore);
    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef, { uid: auth.currentUser.uid });

    await batch.commit();
  };

  return heartDoc?.exists() ? (
    <button onClick={deleteHeart}>Unheart 💔</button>
  ) : (
    <button onClick={addHeart}>Heart ❤️</button>
  );
}
