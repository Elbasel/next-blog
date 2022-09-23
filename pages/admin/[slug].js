import styles from "../../styles/Admin.module.css";
import { useRouter } from "next/router";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firestore, auth } from "../../lib/firebase";
import { useForm } from "react-hook-form";
import React, { useState } from "react";

import AuthCheck from "../../components/AuthCheck";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import ImageUploader from "../../components/ImageUploader";

export default function AdminEditPage() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

const PostManager = () => {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;
  const ref = doc(firestore, `users/${auth.currentUser.uid}/posts/${slug}`);
  const [post] = useDocumentData(ref);
  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>Title: {post.title}</h1>
            <h2>ID: {post.slug}</h2>
            <PostForm postRef={ref} defaultValues={post} preview={preview} />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link target="_blank" href={`/${post.username}/${slug}`}>
              <button className="btn-blue">Live View</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
};

const PostForm = ({ postRef, defaultValues, preview }) => {
  const {
    watch,
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const updatePost = async ({ content, published }) => {
    updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
          <p>Published: {watch("published") ? "✅" : "❌"}</p>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />
        <textarea
          name="content"
          {...register("content", {
            required: "Content can't be empty",
            minLength: { value: 10, message: "Content is too short" },
            maxLength: { value: 2000, message: "Content is too long" },
          })}
        ></textarea>
        <p className="text-danger">{errors?.content?.message}</p>

        <fieldset>
          <input
            {...register("published")}
            type="checkbox"
            name="published"
            id="published"
            className={styles.checkbox}
          />
          <label>Published</label>
        </fieldset>
        <button
          className="btn-green"
          type="submit"
          disabled={!isValid || !isDirty}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
