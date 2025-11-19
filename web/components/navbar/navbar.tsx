// web/components/navbar/navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "./themeToggle";
// import { COMPANY } from "../../lib/companyInfo"; // si lo usas

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalog", label: "Catálogo" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-emerald-100 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
      <nav className="flex items-center justify-between px-4 lg:px-8 py-3">
        {/* Logo + marca */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt="Cleaning Line GP"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Cleaning Line GP
            </span>
            <span className="text-[11px] text-emerald-500 dark:text-emerald-400/80">
              Productos de limpieza profesional
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {/* Links */}
          <div className="hidden md:flex items-center gap-4">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition ${
                    active
                      ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Toggle modo claro/oscuro */}
          <ThemeToggle />

          {/* Botón carrito */}
          <Link
            href="/cart"
            className="
              inline-flex items-center gap-2 rounded-full border border-emerald-300
              bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700
              hover:bg-emerald-100
              dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-600
              dark:hover:bg-emerald-900
              transition
            "
          >
            Carrito
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              0
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
