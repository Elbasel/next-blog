import { Toaster } from "react-hot-toast";

import { AuthContext } from "../lib/AuthContext";

import NavBar from "../components/NavBar";
import "../styles/globals.css";
import { useUserData } from "../lib/hooks";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <AuthContext.Provider value={userData}>
      <NavBar />
      <Component {...pageProps} />
      <Toaster />
    </AuthContext.Provider>
  );
}

export default MyApp;
