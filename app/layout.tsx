import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageTracker } from "@/components/analytics/PageTracker";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://developer.dev"),
  title: {
    default: "ARY DIAN PRATAMA — Website Developer & Digital Craftsman",
    template: "%s | ARDP",
  },
  description:
    "Personal developer portfolio of Ary Dian Pratama (ARDP). High-performance web applications, immersive interactive digital experiences, and clean code architecture.",
  keywords: [
    "Ary Dian Pratama",
    "ARDP",
    "Website Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "GSAP",
    "Full Stack Developer",
    "Portfolio",
  ],
  authors: [{ name: "Ary Dian Pratama" }],
  creator: "Ary Dian Pratama",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png" },
    ],
    apple: "/apple-icon",
  },
  openGraph: {
    title: "ARY DIAN PRATAMA — Website Developer Portfolio",
    description:
      "High-performance web applications and immersive interactive digital experiences.",
    type: "website",
    locale: "en_US",
    siteName: "ARDP Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARY DIAN PRATAMA — Website Developer Portfolio",
    description: "High-performance web applications and immersive digital experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "BOS",
  jobTitle: "Software Developer",
  description:
    "Software developer specializing in high-performance web applications, game modding, and native systems.",
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "C#",
    ".NET Core",
    "Game Modding",
    "System Architecture",
    "WebAssembly",
  ],
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] selection:bg-[#E31B23] selection:text-white antialiased">
        <LanguageProvider>
          <CustomCursor />
          <CommandPalette />
          <PageTracker />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
