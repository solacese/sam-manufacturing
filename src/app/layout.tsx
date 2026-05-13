import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solace Agent+Event Mesh for Manufacturing",
  description: "Real-time event streaming + autonomous AI agents for manufacturing disruption detection and resolution.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="h-full bg-[#0b1120] text-slate-100 font-sans antialiased">{children}</body>
    </html>
  );
}
