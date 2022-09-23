import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  limit,
  DocumentSnapshot,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAMcwr3qsHC_gdwcNuQP1muvPoWx9tLKZQ",
  authDomain: "next-blog-17f9f.firebaseapp.com",
  projectId: "next-blog-17f9f",
  storageBucket: "next-blog-17f9f.appspot.com",
  messagingSenderId: "45325128416",
  appId: "1:45325128416:web:c766e9c4b337435954f685",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();
export const signInWithGooglePopup = async () => {
  try {
    await signInWithPopup(auth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(`User Signed in successfully with the token "${token}"`);
      console.log("User Info:", user);
    });
  } catch (error) {
    console.log("Error signing in user", error);
  }
};

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export const getUserFromUsername = async (username) => {
  const usersCollection = collection(firestore, "users");
  const q = query(usersCollection, where("username", "==", username), limit(1));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0];
};

/**`
 * Gets a users/{uid} document with username
 * @param  {DocumentSnapshot} doc
 */
export const postToJson = (doc) => {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
};
