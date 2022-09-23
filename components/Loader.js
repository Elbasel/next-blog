import React from "react";

export function Loader({ shown }) {
  return shown ? <div className="loader"></div> : null;
}
