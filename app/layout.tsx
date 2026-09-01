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
    default: "BOS — Software Developer Portfolio",
    template: "%s | BOS",
  },
  description:
    "Personal developer portfolio of BOS. High-performance web applications, specialized system software, game modding frameworks, and interactive digital tools.",
  keywords: [
    "Software Developer",
    "Next.js",
    "React",
    "TypeScript",
    "C#",
    ".NET",
    "Game Modding",
    "Systems Engineer",
    "Full Stack",
    "Portfolio",
  ],
  authors: [{ name: "BOS" }],
  creator: "BOS",
  openGraph: {
    title: "BOS — Software Developer Portfolio",
    description:
      "I build digital things. Web applications, systems software, and interactive tools.",
    type: "website",
    locale: "en_US",
    siteName: "BOS Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "BOS — Software Developer Portfolio",
    description: "I build digital things. Web applications and systems software.",
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
        <CustomCursor />
        <CommandPalette />
        <PageTracker />
        {children}
      </body>
    </html>
  );
}
