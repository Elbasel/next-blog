import {
  collection,
  where,
  query,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import React from "react";
import { PostFeed } from "../../components/PostFeed";
import { UserProfile } from "../../components/UserProfile";
import { firestore, getUserFromUsername, postToJson } from "../../lib/firebase";

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}

// get the user data from the server using the query object from
// getServerSideProps
export async function getServerSideProps({ query: queryParameters }) {
  let user = null;
  let posts = null;
  const userDoc = await getUserFromUsername(queryParameters.username);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  if (userDoc) {
    user = userDoc.data();
    const postsCollection = collection(firestore, `users/${userDoc.id}/posts`);

    // get the posts data sub-collection using the username doc
    const postsQuery = query(
      postsCollection,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    posts = (await getDocs(postsQuery)).docs.map(postToJson);
  }

  return {
    props: { user, posts },
  };
}
