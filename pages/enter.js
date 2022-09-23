import { doc, getDoc, writeBatch } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../lib/AuthContext";
import { auth, firestore, signInWithGooglePopup } from "../lib/firebase";
import debounce from "lodash.debounce";
import { signOut } from "firebase/auth";

export default function EnterPage() {
  const { user, username } = useContext(AuthContext);

  return (
    <>
      {user ? (
        username ? (
          <SignOutButton />
        ) : (
          <UsernameForm />
        )
      ) : (
        <SignInButton />
      )}
    </>
  );
}

const SignInButton = () => (
  <button className="btn-google" onClick={signInWithGooglePopup}>
    <img src="./google-logo.png" /> Sign In With Google
  </button>
);

const SignOutButton = () => (
  <button onClick={() => signOut(auth)}>Sign Out</button>
);

const UsernameForm = () => {
  const [formValue, setFormValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const { user, username } = useContext(AuthContext);
  //check the form value on the server when it changes
  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  //debounce works after 500ms after the last event
  //callback to ensure state persistance through re-renders
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore, "usernames", username);
        const docSnap = await getDoc(ref);
        console.log("firestore read executed!");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDoc = doc(firestore, "users", user.uid);
    const usernameDoc = doc(firestore, "usernames", formValue);

    const batch = writeBatch(firestore);

    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });

    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (value.length < 3) {
      setFormValue(value);
      setIsValid(false);
      setLoading(false);
    }

    if (re.test(value)) {
      setFormValue(value);
      setIsValid(false);
      setLoading(true);
    }
  };

  return (
    !username && (
      <>
        <form onSubmit={handleSubmit}>
          <h3>Choose Username</h3>
          <input
            placeholder="Awesome Username"
            value={formValue}
            type="text"
            onChange={handleChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button className="btn-green" type="submit" disabled={!isValid}>
            Choose
          </button>
        </form>
        <div>
          <h3>Debug Values</h3>
          <div>
            <p>formValue: {formValue}</p>
            <p>loading: {loading.toString()}</p>
            <p>isValid: {isValid.toString()}</p>
          </div>
        </div>
      </>
    )
  );
};

function UsernameMessage({ username, isValid, loading }) {
  if (loading) return <p>Checking...</p>;
  else if (isValid)
    return <p className="text-success">{username} is available!</p>;
  else if (username && !isValid)
    return <p className="text-danger">{username} is not available</p>;
  else return <p></p>;
}
