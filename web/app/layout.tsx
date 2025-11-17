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
      <body className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4">
          <Navbar />
          <main className="py-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

