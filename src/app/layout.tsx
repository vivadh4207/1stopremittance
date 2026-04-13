import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "1StopRemittance - Send Money Worldwide | Best Rates & Lowest Fees",
  description: "Send money to 200+ countries with the best exchange rates and lowest fees. Fast, secure, and reliable international money transfers.",
  keywords: "send money, international transfer, remittance, exchange rate, money transfer, wire transfer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
