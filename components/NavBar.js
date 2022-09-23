import Link from "next/link";
import React, { useContext, useState } from "react";
import { AuthContext } from "../lib/AuthContext";

export default function NavBar() {
  const { user, username } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 500);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">Feed</button>
          </Link>
        </li>

        {!loading && (
          <>
            {username && (
              <>
                <li className="push-left">
                  <Link href="/admin">
                    <button className="btn-blue">Write Post</button>
                  </Link>
                </li>

                <li>
                  <Link href={`/${username}`}>
                    <img src={user?.photoURL} />
                  </Link>
                </li>
              </>
            )}

            {!username && (
              <>
                <li>
                  <Link href="/enter">
                    <button>Sign In</button>
                  </Link>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}
