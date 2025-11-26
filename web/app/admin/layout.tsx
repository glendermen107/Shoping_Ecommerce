"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RequireAdmin from "../../components/auth/requireAdmin";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Productos" },
  { href: "/admin/orders", label: "Órdenes" },
  { href: "/admin/customers", label: "Clientes (local)" },
];

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      {/* Header sidebar */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
        <div>
          <p className="text-sm font-semibold tracking-tight">Cleaning Admin</p>
          <p className="text-[11px] text-muted-foreground">
            Panel de control · tweakcn
          </p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 px-3 py-4 text-sm">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center justify-between rounded-full px-3 py-2 text-xs font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              ].join(" ")}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer sidebar */}
      <div className="border-t border-sidebar-border px-4 py-3 text-[11px] text-muted-foreground">
        Cleaning Line GP · Admin
      </div>
    </aside>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar izquierda */}
        <AdminSidebar />

        {/* Contenido principal */}
        <main className="flex-1 flex flex-col">
          {/* Barra superior */}
          <header className="flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Panel de administración
              </p>
              <p className="text-sm font-medium leading-none">
                Dashboard general
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Admin</span>
            </div>
          </header>

          {/* Zona de contenido */}
          <section className="flex-1 bg-background px-4 py-6 md:px-6">
            <div className="mx-auto max-w-6xl space-y-6">{children}</div>
          </section>
        </main>
      </div>
    </RequireAdmin>
  );
}
