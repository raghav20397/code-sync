import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/react"; // 1. Import the tRPC provider

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "CodeSync",
  description: "Real-time code collaboration",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. Keep ClerkProvider as the top-level wrapper for auth
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          {/* 3. Wrap the children in TRPCReactProvider to enable API queries */}
          <TRPCReactProvider>
             {children}
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}