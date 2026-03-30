import type { Metadata } from "next";
import { DM_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const dmSans = DM_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Móveis Planejados - Sistema de Gestão",
  description: "Sistema de gestão completo para pequenas e médias empresas de móveis planejados. Orçamento rápido, controle de produção e financeiro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-full antialiased font-body`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
