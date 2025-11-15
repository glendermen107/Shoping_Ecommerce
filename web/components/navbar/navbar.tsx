"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCart, getCartTotals } from "../../lib/cart";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalog", label: "Catálogo" },
  { href: "/contact", label: "Contacto" },
  { href: "/admin", label: "Admin" }, // Más adelante lo protegeremos con auth
];

export default function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = getCart();
    const { totalQuantity } = getCartTotals(cart);
    setCartCount(totalQuantity);
  }, []);

  return (
    <header className="flex items-center justify-between py-4 border-b border-neutral-200">
      {/* Logo / Marca */}
      <Link href="/" className="text-xl font-semibold">
        MiTienda
        <span className="ml-1 text-xs font-normal text-neutral-500">
          · Limpieza
        </span>
      </Link>

      {/* Navegación principal */}
      <nav className="flex items-center gap-6 text-sm">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-black transition ${
                isActive ? "font-medium text-black" : "text-neutral-600"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        {/* Separador visual */}
        <span className="h-4 w-px bg-neutral-300" />

        {/* Link de Ingreso */}
        <Link
          href="/auth/login"
          className="text-sm text-neutral-700 hover:text-black"
        >
          Ingresar
        </Link>

        {/* Carrito con contador */}
        <Link
          href="/cart"
          className="flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100 transition"
        >
          <span>Carrito</span>
          <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-neutral-900 text-white text-xs">
            {cartCount}
          </span>
        </Link>
      </nav>
    </header>
  );
}

