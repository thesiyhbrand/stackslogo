import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevIcons — Your stack. Your style. One URL.",
  description: "Build and embed a visual developer stack as SVG."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
