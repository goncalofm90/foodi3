import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/contexts/ToastContext";

export const metadata: Metadata = {
  title: "Foodi3",
  description: "Recipes & Cocktails, always at your fingertips.",
  openGraph: {
    title: "Foodi3",
    description: "Recipes & Cocktails, always at your fingertips.",
    images: [
      {
        url: "https://foodi3.appwrite.network/cooking.png",
        width: 1200,
        height: 630,
        alt: "Foodi3 Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foodi3",
    description: "Recipes & Cocktails, always at your fingertips.",
    images: ["https://foodi3.appwrite.network/cooking.png"],
  },
  icons: {
    icon: "/cooking.png",
    shortcut: "/cooking.png",
    apple: "/cooking.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
