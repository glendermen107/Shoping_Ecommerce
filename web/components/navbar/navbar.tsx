// web/components/navbar/navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "./themeToggle";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalog", label: "Catálogo" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },

];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="border-b border-emerald-100 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
      <nav className="flex w-full items-center justify-between px-3 sm:px-4 lg:px-8 py-3">
        {/* Logo + marca */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Image
            src="/logo.jpeg"
            alt="Cleaning Line GP"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Cleaning Line GP
            </span>
            {/* Subtítulo SOLO desde sm (≥640px) */}
            <span className="hidden sm:block text-[11px] text-emerald-500 dark:text-emerald-400/80">
              Productos de limpieza profesional
            </span>
          </div>
        </Link>

        {/* Zona derecha: escritorio */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          {/* Links */}
          <div className="flex items-center gap-4">
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

          {/* Toggle tema */}
          <ThemeToggle />

          {/* Carrito */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-600 dark:hover:bg-emerald-900 transition"
          >
            Carrito
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              0
            </span>
          </Link>
        </div>

        {/* Zona derecha: móvil / tablet pequeña */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <Link
            href="/cart"
            className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-600 dark:hover:bg-emerald-900 transition"
          >
            🛒
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
              0
            </span>
          </Link>

          {/* Botón hamburguesa */}
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Abrir menú"
          >
            <span className="sr-only">Abrir menú</span>
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${
                  isOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-opacity ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${
                  isOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {isOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/95 dark:bg-slate-950 dark:border-slate-800">
          <div className="w-full px-4 py-3 space-y-2 text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`block rounded-full px-3 py-2 transition ${
                    active
                      ? "bg-emerald-50 text-emerald-700 dark:bg-slate-800 dark:text-emerald-300 font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
