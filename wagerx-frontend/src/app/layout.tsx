import type { Metadata } from "next";
import { Oxanium, Lato } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { QueryProvider } from "@/components/QueryProvider";

const oxanium = Oxanium({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oxanium",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "WagerX",
  description: "A Social Prediction Market for Friend Groups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oxanium.variable} ${lato.variable} antialiased`}>
        <QueryProvider>
          <WalletProvider>{children}</WalletProvider>{" "}
        </QueryProvider>
      </body>
    </html>
  );
}
