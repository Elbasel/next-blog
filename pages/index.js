import { useState } from "react";
import {
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  Timestamp,
} from "firebase/firestore";
import { firestore, postToJson } from "../lib/firebase";

import { Loader } from "../components/Loader";
import { PostFeed } from "../components/PostFeed";

const LIMIT = 3;

export async function getServerSideProps() {
  const postsGroup = collectionGroup(firestore, "posts");
  const q = query(
    postsGroup,
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );
  const posts = (await getDocs(q)).docs.map(postToJson);

  return {
    props: { posts },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postEnd, setPostEnd] = useState(false);

  const getMorePosts = async () => {
    const postsGroup = collectionGroup(firestore, "posts");

    const last = posts[posts.length - 1];
    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    const q = query(
      postsGroup,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(LIMIT),
      startAfter(cursor)
    );

    setLoading(true);

    const newPosts = (await getDocs(q)).docs.map(postToJson);

    setLoading(false);
    setPosts(posts.concat(newPosts));

    if (newPosts.length < LIMIT) setPostEnd(true);
  };

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postEnd && (
        <button onClick={getMorePosts}>Load More</button>
      )}
      <Loader shown={loading} />
      {postEnd && <p>You have reached the end!</p>}
    </main>
  );
}
