import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: { default: "Calavera Gaucha — Impresión 3D a Medida", template: "%s | Calavera Gaucha" },
  description: "Impresión 3D bajo demanda. Llaveros, figuras, decoración y objetos únicos hechos en Argentina.",
  keywords: ["impresión 3D", "impresión 3D Argentina", "llaveros 3D", "figuras 3D", "presupuesto 3D"],
  openGraph: {
    siteName: "Calavera Gaucha",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
