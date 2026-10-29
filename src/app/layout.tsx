import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Little Gift Together • Letters for My Love",
  description: "Create and share cute, interactive romantic love letters and surprise envelopes with mini-puzzles.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Dancing+Script:wght@500;700&family=Nunito:ital,wght@0,300..900;1,300..900&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col font-sans selection:bg-pink-200 selection:text-pink-900 overflow-x-hidden"
        style={{ fontFamily: "'Nunito', 'Outfit', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
