import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nvidia FE Stock Checker",
  description: "Every so often polls Nvidia store api for stock updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script id="theme">
          {`
            if (typeof window !== undefined) {
              const userSettings = localStorage.getItem("userSettings");

              const parsedUserSettings = JSON.parse(userSettings);

              if (parsedUserSettings.theme) {
                document.documentElement.setAttribute("data-theme", parsedUserSettings.theme);
              }
            }
          `}
        </script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
