import { config } from "@/config";
import { cookieToInitialState } from "@account-kit/core";
import type { Metadata } from "next";
//import { Inter } from "next/font/google";
import { Londrina_Solid } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/navbar"; // Adjust the path if needed
import "./globals.css"; // Import your global styles where the font is defined


// Define the Londrina_Solid font with any desired options
const londrinaSolid = Londrina_Solid({
  subsets: ['latin'],  // Specify the subset, if needed
  weight: ['400'],     // Specify font weights (if available)
});

export const metadata: Metadata = {
  title: "DCAwesome",
  description: "Automate DCA into your favourite assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Persist state across pages
  // https://accountkit.alchemy.com/react/ssr#persisting-the-account-state
  const initialState = cookieToInitialState(
    config,
    headers().get("cookie") ?? undefined
  );

  return (
    <html lang="en">
      <body style={{ fontFamily: 'Sf Pro Rounded, sans-serif' }}>
        <Providers initialState={initialState}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
