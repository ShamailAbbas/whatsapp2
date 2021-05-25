import "../styles/globals.css";

import { Authcontext } from "./context/context";

function MyApp({ Component, pageProps }) {
  return (
    <Authcontext>
      <Component {...pageProps} />
    </Authcontext>
  );
}

export default MyApp;
