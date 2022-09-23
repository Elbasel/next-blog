import React, { useContext, useState } from "react";
import AuthCheck from "../../components/AuthCheck";
import { PostFeed } from "../../components/PostFeed";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import kebabCase from "lodash.kebabcase";
import { firestore, auth } from "../../lib/firebase";
import { AuthContext } from "../../lib/AuthContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import styles from "../../styles/Admin.module.css";

export default function AdminPostsPage() {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}
const PostList = () => {
  let posts = null;
  const postsRef = collection(firestore, `users/${auth.currentUser.uid}/posts`);
  const q = query(postsRef, orderBy("createdAt", "desc"));
  const postsCollection = useCollection(q);

  if (postsCollection[0]) {
    posts = postsCollection[0].docs.map((post) => post.data());
  }

  return (
    <>
      <h1>Manage Your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
};

const CreateNewPost = () => {
  const { username } = useContext(AuthContext);
  const router = useRouter();
  const [title, setTitle] = useState("");

  const isValid = title.length > 3 && title.length < 100;
  const slug = encodeURI(kebabCase(title));

  const createPost = async (e) => {
    const uid = auth.currentUser.uid;
    e.preventDefault();
    const newPost = doc(firestore, `users/${uid}/posts/${slug}`);

    const data = {
      title,
      username,
      content: "placeholder content",
      slug,
      heartCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      published: false,
      uid,
    };
    await setDoc(newPost, data);

    toast.success("Post Added");
    router.push(`admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <h1>Add a post</h1>
      <input
        placeholder="My Awesome title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        name="title"
        id="title"
        className={styles.input}
      />
      <button className="btn-green" disabled={!isValid} type="submit">
        Add Post
      </button>
      <p>Slug: {encodeURI(kebabCase(title))}</p>
    </form>
  );
};
