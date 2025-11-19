import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { AppThemeProvider } from "../components/themes/themeProvider";

export const metadata: Metadata = {
  title: "Cleaning Line GP · Limpieza y aseo",
  description: "Productos de limpieza para hogar y empresas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className="
          min-h-screen
          bg-slate-50 text-slate-900
          dark:bg-slate-950 dark:text-slate-100
        "
      >
        <AppThemeProvider>
          <div className="w-full">
            <Navbar />
            <main className="py-6 px-4 lg:px-8">{children}</main>
            <Footer />
          </div>
        </AppThemeProvider>
      </body>
    </html>
  );
}
