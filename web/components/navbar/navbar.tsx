// web/components/navbar/navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { COMPANY } from "../../lib/companyInfo";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalog", label: "Catálogo" },
  { href: "/contacto", label: "Contacto" },
  { href: "/faq", label: "Preguntas frecuentes" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-emerald-100 bg-white/80 backdrop-blur">
      <nav className="flex items-center justify-between px-4 lg:px-8 py-3">
        {/* Logo + marca */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt={COMPANY.brandName}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-emerald-700">
              {COMPANY.brandName}
            </span>
            <span className="text-[11px] text-emerald-500">
              Productos de limpieza profesional
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  active
                    ? "text-emerald-700 font-semibold"
                    : "text-slate-600 hover:text-emerald-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Botón carrito (si ya lo tenías, adapta esta parte) */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition"
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
