import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solace Agent+Event Mesh for Manufacturing",
  description: "Real-time event streaming + autonomous AI agents for manufacturing disruption detection and resolution. 9 agents coordinate via A2A protocol on the Solace Platform.",
  openGraph: {
    title: "Solace Agent+Event Mesh for Manufacturing",
    description: "Interactive demo: AI agents detect and resolve manufacturing disruptions in real-time via Solace event mesh. 306 flows, 8 industries, LLM-powered.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <head>
        <meta name="theme-color" content="#0b1120" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="h-full bg-[#0b1120] text-slate-100 font-sans antialiased">{children}</body>
    </html>
  );
}
