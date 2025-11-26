"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "../cart/cartContext";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { totalQuantity } = useCart();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-200 bg-white/90 backdrop-blur-md shadow-sm">
      <nav className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        {/* Logo + marca */}
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <Image
            src="/logo.jpeg"
            alt="Cleaning Line GP"
            width={42}
            height={42}
            className="rounded-full border border-emerald-300 shadow-sm"
          />
          <div className="leading-tight">
            <p className="text-[15px] font-bold text-emerald-800">
              Cleaning Line GP
            </p>
            <p className="hidden text-[11px] text-emerald-500 sm:block">
              Productos de limpieza profesional
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-6 md:flex">
          {/* Menú “skew” estilo ejemplo */}
          <ul className="flex items-center gap-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li
                  key={link.href}
                  className={[
                    "relative transform skew-x-12 rounded shadow-sm transition-colors",
                    active
                      ? "bg-emerald-700"
                      : "bg-emerald-800 hover:bg-emerald-600",
                  ].join(" ")}
                >
                  <Link
                    href={link.href}
                    className="block transform -skew-x-12 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Login */}
          <Link
            href="/auth/login"
            className="inline-flex items-center rounded-full border border-emerald-300 bg-white px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50"
          >
            Iniciar sesión
          </Link>

          {/* Luego */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500"
          >
            🛒 Carrito
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold">
              {totalQuantity}
            </span>
          </Link>
        </div>

        {/* MOBILE / TABLET CHICA */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Login primero en mobile */}
          <Link
            href="/auth/login"
            className="flex items-center rounded-full border border-emerald-300 bg-white px-3 py-1 text-[11px] font-medium text-emerald-700 shadow-sm hover:bg-emerald-50"
          >
            Iniciar
          </Link>

          {/* Carrito */}
          <Link
            href="/cart"
            className="flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm hover:bg-emerald-100"
          >
            🛒
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
              {totalQuantity}
            </span>
          </Link>

          {/* Botón hamburguesa */}
          <button
            type="button"
            onClick={toggleMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-sm hover:bg-emerald-50"
            aria-label="Abrir menú"
          >
            <div className="space-y-1">
              <span
                className={`block h-0.5 w-5 rounded-full bg-emerald-900 transition-transform ${
                  isOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-emerald-900 transition-opacity ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-emerald-900 transition-transform ${
                  isOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* MENÚ MÓVIL */}
      {isOpen && (
        <div className="border-t border-emerald-100 bg-white/95 shadow-sm md:hidden">
          <div className="flex flex-col gap-2 px-5 py-4 text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={[
                    "rounded-full px-3 py-2 transition-colors",
                    active
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-emerald-800 hover:bg-emerald-50",
                  ].join(" ")}
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
