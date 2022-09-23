import React, { useState } from "react";
import { auth, storage } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader } from "./Loader";

export default function ImageUploader() {
  const uploadFile = (e) => {
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];
    const fileRef = ref(
      storage,
      `/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );

    setUploading(true);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const currentProgress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        console.log(currentProgress);
        setProgress(currentProgress);
      },
      (error) => {
        console.log("error occurred while uploading file", error);
      },
      () => {
        setUploading(false);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>
          setDownloadURL(downloadUrl)
        );
      }
    );
  };

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURl, setDownloadURL] = useState(null);

  return (
    <div className="box">
      <Loader shown={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            Upload file
            <input
              type="file"
              name="image"
              id="image"
              onChange={uploadFile}
              accept="image/*"
            />
          </label>
        </>
      )}

      {downloadURl && (
        <code className="upload-snippet">{`![alt](${downloadURl})`}</code>
      )}
    </div>
  );
}
