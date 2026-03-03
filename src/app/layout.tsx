import type { Metadata } from "next";
import { Freeman, Libre_Franklin } from "next/font/google";
import "./globals.css";

const freeman = Freeman({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-freeman",
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Criterion — Onboarding",
  description: "Welcome to Criterion. Purposeful Banking.",
  icons: {
    icon: "/favcriterion.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: Promise<Record<string, string | string[]>>;
}>) {
  // Await params to satisfy Next.js 16 async dynamic APIs (avoids "params are being enumerated" error)
  await (params ?? Promise.resolve({}));

  return (
    <html lang="en" className={`${freeman.variable} ${libreFranklin.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
