import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reviive — El taller donde el tiempo se devuelve",
  description:
    "Reviive conecta recuerdos, personas y tiempo a través de experiencias de restauración artesanal únicas.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-marfil text-carbon">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
