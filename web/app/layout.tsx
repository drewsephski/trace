import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trace — Beautiful Screen Recordings",
  description:
    "Trace is a free, open-source tool for creating polished screen recordings, product demos, and walkthroughs. 100% free, no strings attached.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
