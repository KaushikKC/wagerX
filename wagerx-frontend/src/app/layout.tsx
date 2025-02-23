import type { Metadata } from "next";
import { Oxanium, Lato } from "next/font/google";
import "./globals.css";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

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
        <AptosWalletAdapterProvider
          autoConnect={true}
          dappConfig={{
            network: Network.DEVNET,
            aptosApiKeys: {
              [Network.DEVNET]: "AG-4JIRXVTIU48VKEXVC762MTF9MYY7UBPGX",
            },
          }}
          onError={(error) => {
            console.log("error", error);
          }}
        >
          {children}
        </AptosWalletAdapterProvider>
      </body>
    </html>
  );
}
