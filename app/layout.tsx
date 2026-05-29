import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Home | Andrés Morgan's Portfolio",
  description:
    "Personal portfolio of Andrés Morgan — a software developer focused on turning product ideas into reliable backend systems.",
  metadataBase: new URL("https://morgancacm.vercel.app"),
  openGraph: {
    title: "Andrés Morgan — Software Developer",
    description:
      "Personal portfolio of Andrés Morgan — a software developer focused on turning product ideas into reliable backend systems.",
    type: "website",
    url: "https://morgancacm.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 pt-28 sm:pt-32 md:pt-36">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
