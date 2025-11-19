import type { ReactNode } from "react";
import "../styles/globals.css";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";

export const metadata = {
  title: "E-commerce",
  description: "Tienda online",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {/* Contenedor a lo ancho, con un poco de padding lateral */}
        <div className="w-full">
          <Navbar />
          <main className="py-6 px-4 lg:px-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

