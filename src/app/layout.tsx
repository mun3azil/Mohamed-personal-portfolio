import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import PerformanceMonitor from "@/components/common/PerformanceMonitor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Define base URL for canonical links and OG images
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourportfolio.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#121212" }, { color: "#ffffff" }],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Mohamed | Full Stack Developer",
    template: "%s | Mohamed's Portfolio"
  },
  description: "Personal portfolio website of Mohamed, a Full Stack Developer specializing in modern web applications with React, Next.js, and TypeScript.",
  keywords: ["full stack developer", "web developer", "portfolio", "react", "next.js", "tailwindcss", "typescript", "frontend", "backend"],
  authors: [{ name: "Mohamed", url: baseUrl }],
  creator: "Mohamed",
  publisher: "Mohamed",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'ar': '/ar',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_SA"],
    url: baseUrl,
    siteName: "Mohamed's Portfolio",
    title: "Mohamed | Full Stack Developer",
    description: "Personal portfolio website of Mohamed, a Full Stack Developer specializing in modern web applications.",
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Mohamed - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed | Full Stack Developer",
    description: "Personal portfolio website of Mohamed, a Full Stack Developer specializing in modern web applications.",
    creator: "@yourtwitterhandle",
    images: [`${baseUrl}/images/twitter-image.jpg`],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    // Add other verification codes as needed
  },
  icons: {
    icon: [
      { url: "/icons/favicon.ico" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/avatar-main.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#0ea5e9",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <Providers>
          <PerformanceMonitor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
