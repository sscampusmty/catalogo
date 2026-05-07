import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Servicio Social MTY",
  description: "Plataforma de Servicio Social del Tecnológico de Monterrey",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="favicon.ico" sizes="any" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
