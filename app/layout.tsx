import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-Powered Fluff Detector",
  description:
    "Find out how much fluff you're writing and how you can fix it using AI!",
  openGraph: {
    images: "https://www.fluff-detector.vercel.app/og.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://beamanalytics.b-cdn.net/beam.min.js"
          data-token="6728c254-9049-4c5d-9663-79665b7906f3"
          async
        ></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
