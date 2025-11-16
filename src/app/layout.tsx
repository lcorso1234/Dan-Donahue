import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dan Donahue | Business Card",
  description: "Mobile-first business card for Dan Donahue with an interactive save button.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
