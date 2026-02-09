import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/contexts/ToastContext";

export const metadata: Metadata = {
  title: "Foodi3",
  description: "Search and save recipes and cocktails",
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
