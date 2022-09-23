import React from "react";
import {
  doc,
  getDocs,
  collectionGroup,
  query,
  where,
  limit,
} from "firebase/firestore";
import styles from "../../styles/Post.module.css";
import { firestore, getUserFromUsername, postToJson } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import PostContent from "../../components/PostContent";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";

export async function getStaticProps({ params }) {
  const { username, slug } = params;

  //fireship implementation
  // let post = null;

  // const userDoc = await getUserFromUsername(username);

  // if (userDoc) {
  //   const postRef = doc(firestore, `users/${userDoc.id}/posts/${slug}`);
  //   const postDoc = await getDoc(postRef);
  //   if (postDoc.data()) {
  //     post = postToJson(postDoc);
  //   }
  // }

  //alternative implementation
  let post = null;
  let path = null;
  const postsGroup = collectionGroup(firestore, "posts");
  const q = query(
    postsGroup,
    where("username", "==", username),
    where("slug", "==", slug),
    limit(1)
  );
  const postsDocs = (await getDocs(q)).docs;
  if (postsDocs.length > 0) {
    post = postToJson(postsDocs[0]);
    path = postsDocs[0].ref.path;
  }

  return { props: { post, path } };
}

export async function getStaticPaths() {
  const postsGroup = collectionGroup(firestore, "posts");
  const postsDocs = (await getDocs(postsGroup)).docs;

  const paths = postsDocs.map((doc) => {
    const { username, slug } = doc.data();

    return { params: { username, slug } };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function PostPage(props) {
  let ref;

  if (props.path) {
    ref = doc(firestore, props.path);
  }

  const [realtimePost] = useDocumentData(ref);

  const post = realtimePost || props.post;

  if (!post) {
    return (
      <>
        <p>Post Not Found!</p>
        <Link href="/">
          <button>Go To Homepage</button>
        </Link>
      </>
    );
  }

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>❤️ Sign Up to heart</button>
            </Link>
          }
        >
          <HeartButton postRef={ref} />
        </AuthCheck>
      </aside>
    </main>
  );
}
