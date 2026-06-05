import type { Metadata } from "next";
import { Orbitron, Montserrat } from "next/font/google";
import { Providers } from "./providers";
import { InstallPrompt } from "../components/InstallPrompt";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Back Discipline - Método Mountain Dog",
  description: "Um guia prático de 6 semanas para construir costas épicas usando o método John Meadows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${orbitron.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <InstallPrompt />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}