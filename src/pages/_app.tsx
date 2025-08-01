import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/logo_sekolah.ico" />
        <title>SMKN 4 MATARAM</title> {/* Optional */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}
