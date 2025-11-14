// web/app/admin/layout.tsx
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <header className="border-b border-neutral-800 pb-3">
        <h1 className="text-xl font-semibold">Panel de administración</h1>
        <p className="text-sm text-neutral-400">
          Gestión de productos, pedidos y configuración del sitio.
        </p>
      </header>
      {children}
    </div>
  );
}
