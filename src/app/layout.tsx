import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArqIA — Plataforma de Arquitetura com Inteligência Artificial",
  description:
    "Gere plantas baixas, esquemas estruturais e renders de interiores com IA. Conecte clientes a profissionais de arquitetura e engenharia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme');var d=document.documentElement;if(s==='dark'||(s===null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
