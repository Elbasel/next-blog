import Link from "next/link";
import React from "react";

export default function Custom404() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>This Page Doesn't exist!</h1>
      <img
        style={{
          width: "60%",
          height: 400,
          borderRadius: 24,
          margin: "auto",
          display: "block",
        }}
        src="https://media3.giphy.com/media/UoeaPqYrimha6rdTFV/giphy.gif?cid=790b761171a80e45564acf3ae5fc292701367d2742a3daaa&rid=giphy.gif&ct=g"
      />
      <Link href="/">
        <button style={{ margin: "auto" }} className="btn-blue">
          Go back Home
        </button>
      </Link>
    </div>
  );
}
