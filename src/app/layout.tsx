import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radar Concursos | Concursos e seleções no RJ",
  description:
    "Encontre concursos públicos e seleções no Rio de Janeiro por área profissional e confira os requisitos de cada edital.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
