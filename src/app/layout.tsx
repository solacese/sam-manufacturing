import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solace Agent Mesh — Manufacturing Intelligence",
  description: "Event-driven AI agent coordination for manufacturing. Powered by Solace Platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="h-full bg-[#0b1120] text-slate-100 font-sans antialiased">{children}</body>
    </html>
  );
}
