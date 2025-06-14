import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./provider";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "@/wagmi";

export const metadata: Metadata = {
  title: "web3 assistant",
  description: "help your to manage your web3 assets",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get('cookie'),
  )
  
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Providers initialState={initialState}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
