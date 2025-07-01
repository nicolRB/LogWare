import type {Metadata} from "next";
import {GeistSans} from "geist/font/sans";
import {GeistMono} from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogWare",
  description: "Sistema de gestão de relatórios com assinatura digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
        // Adicione esta prop para suprimir o aviso de hidratação no body
        // Use com cautela e apenas se você entender o motivo do erro.
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
