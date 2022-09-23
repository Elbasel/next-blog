import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";

export default function PostContent({ post }) {
  const createdAt =
    typeof post.created === "number"
      ? new Date(post.createdAt)
      : Timestamp.fromMillis(post.createdAt).toDate();
  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{" "}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{" "}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}
