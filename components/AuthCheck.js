import React, { useContext } from "react";
import { AuthContext } from "../lib/AuthContext";
import Link from "next/link";
export default function AuthCheck(props) {
  const { username } = useContext(AuthContext);
  return username
    ? props.children
    : props.fallback || (
        <Link href="/enter">
          <p>
            You must be{" "}
            <span style={{ color: "dodgerblue", cursor: "pointer" }}>
              Signed in
            </span>{" "}
            to view this page
          </p>
        </Link>
      );
}
