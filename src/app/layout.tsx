
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "../components/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Modals } from "@/components/modal";
import { Toaster } from "sonner";
import JotaiProvider from "@/components/jotai-provider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sync-Room",
  description: "Created by Saif",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
    <html lang="en">
       <link rel="icon" type="image/png" href="/syncRoomLogo.jpg" /> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ConvexClientProvider>
            <JotaiProvider>
             <Toaster/>
             <Modals/>
            {children}
            </JotaiProvider>
            </ConvexClientProvider>
      </body>
    </html>
    </ConvexAuthNextjsServerProvider>

  );
}
