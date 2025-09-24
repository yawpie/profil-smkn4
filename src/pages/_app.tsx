import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Merriweather_Sans, DM_Serif_Text } from 'next/font/google';

const merriweatherSans = Merriweather_Sans({
  subsets: ["latin"],
  variable: "--font-merriweather-sans",
  weight: ['300','700'],
});

const dmSerifText = DM_Serif_Text({
  subsets: ["latin"],
  variable: "--font-dm-serif-text",
  weight: ['400'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>SMKN 4 MATARAM</title> {/* Optional */}
      </Head>
      <div className={merriweatherSans.variable}>

      <Component {...pageProps} />
      </div>
    </>
  );
}
