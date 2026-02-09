import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/contexts/ToastContext";

export const metadata: Metadata = {
  title: "Foodi3",
  description: "Search and save recipes and cocktails",
  openGraph: {
    title: "Foodi3",
    description: "Search and save recipes and cocktails",
    images: [
      {
        url: "/foodi3.jpg",
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
    description: "Search and save recipes and cocktails",
    images: ["/foodi3.jpg"],
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
