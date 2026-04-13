import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "1StopRemittance - Compare Money Transfer Rates | Send to Nigeria & Philippines",
  description: "Compare exchange rates and fees from Wise, Remitly, Western Union & more. Find the cheapest way to send money from the US to Nigeria and Philippines. Save up to 8x on fees.",
  keywords: "send money to Nigeria, send money to Philippines, remittance comparison, money transfer rates, NGN exchange rate, PHP exchange rate, Nigerian diaspora, Filipino diaspora, cheapest money transfer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-white">
        {children}
      </body>
    </html>
  );
}
