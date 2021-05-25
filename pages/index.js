import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useGlobalContext } from "./context/context";
import Login from "./login";
export default function Home() {
  const { state } = useGlobalContext();

  if (state.user === null) return <Login />;
  return (
    <div>
      <Head>
        <title>Whatsapp 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
    </div>
  );
}
