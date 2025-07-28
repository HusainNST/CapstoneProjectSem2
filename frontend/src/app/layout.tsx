import type { Metadata, Viewport } from "next";
import { Lilita_One } from "next/font/google";
import "./globals.css";

const lilitaOne = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flippy - Memory Game",
  description: "Test your memory with Flippy, an interactive memory card game with multiple difficulty levels.",
  keywords: ["memory game", "card game", "brain training", "puzzle"],
  authors: [{ name: "Flippy Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={lilitaOne.className}>
        {children}
      </body>
    </html>
  );
}
