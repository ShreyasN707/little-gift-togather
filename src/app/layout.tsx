import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keepsake • Vintage Letters & Bespoke Envelopes",
  description: "An extraordinary vintage letter and antique envelope experience sealed with interactive memories.",
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
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Great+Vibes&family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Caveat:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col font-sans bg-[#1a1410] text-[#2c1d11] selection:bg-amber-200 selection:text-amber-950"
        style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
