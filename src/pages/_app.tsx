import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { merriweatherSans, sourceSerif } from "../fonts";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>SMKN 4 MATARAM</title> {/* Optional */}
      </Head>
      <div className={`${merriweatherSans.variable} ${sourceSerif.variable}`}>

      <Component {...pageProps} />
      </div>
    </>
  );
}
