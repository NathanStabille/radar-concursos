import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radar Concursos | Concursos e seleções de TI",
  description:
    "Acompanhe editais de TI no estado do Rio de Janeiro compatíveis com tecnólogo em Análise e Desenvolvimento de Sistemas.",
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
