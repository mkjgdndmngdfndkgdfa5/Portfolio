import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "kz — Portfolio | Roblox Systems & Development",
  description: "Portfolio de kz — sistemas, jogos e criações no Roblox Studio. Confira os projetos, veja imagens e vídeos dos meus trabalhos.",
  openGraph: {
    title: "kz — Portfolio",
    description: "Sistemas e criações no Roblox Studio",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
