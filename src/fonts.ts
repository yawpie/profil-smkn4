import { Source_Serif_4 } from "next/font/google";
import { Merriweather_Sans, DM_Serif_Text } from 'next/font/google';

export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const merriweatherSans = Merriweather_Sans({
  subsets: ["latin"],
  variable: "--font-merriweather-sans",
  weight: ['300','700'],
});

export const dmSerifText = DM_Serif_Text({
  subsets: ["latin"],
  variable: "--font-dm-serif-text",
  weight: ['400'],
});
