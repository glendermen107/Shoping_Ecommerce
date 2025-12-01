// web/app/admin/customers/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Customer } from "../../../lib/types";

const STORAGE_KEY = "adminCustomers";

const currencyCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

// Datos de ejemplo para inicializar (si no hay nada en localStorage)
const initialCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "María González",
    email: "maria@example.com",
    phone: "+56 9 1234 5678",
    createdAt: new Date().toISOString(),
    ordersCount: 3,
    totalSpent: 75990,
  },
  {
    id: "CUST-002",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+56 9 8765 4321",
    createdAt: new Date().toISOString(),
    ordersCount: 1,
    totalSpent: 15990,
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // ──────────────── CARGA INICIAL ────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Customer[] = JSON.parse(saved);
        setCustomers(parsed);
      } else {
        setCustomers(initialCustomers);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(initialCustomers)
        );
      }
    } catch (err) {
      console.error("Error cargando clientes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCustomers = (next: Customer[]) => {
    setCustomers(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const filteredCustomers = useMemo(() => {
    const text = search.trim().toLowerCase();

    return customers
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      )
      .filter((c) => {
        if (!text) return true;
        return (
          c.name.toLowerCase().includes(text) ||
          c.email.toLowerCase().includes(text) ||
          (c.phone ?? "").toLowerCase().includes(text)
        );
      });
  }, [customers, search]);

  const totalCustomers = customers.length;
  const totalOrders = customers.reduce(
    (acc, c) => acc + (c.ordersCount ?? 0),
    0
  );
  const totalRevenue = customers.reduce(
    (acc, c) => acc + (c.totalSpent ?? 0),
    0
  );

  if (loading) {
    return (
      <p className="text-base text-muted-foreground">
        Cargando clientes…
      </p>
    );
  }

  return (
    <section className="space-y-6">
      {/* Encabezado con métricas */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Clientes (local)
            </h2>
            <p className="text-base text-foreground">
              Registro de clientes que han comprado o creado cuenta.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card px-5 py-4 text-card-foreground shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Clientes registrados
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {totalCustomers}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card px-5 py-4 text-card-foreground shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Órdenes asociadas
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card px-5 py-4 text-card-foreground shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Total en compras
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {currencyCLP.format(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Filtro de búsqueda */}
      <div className="flex flex-wrap gap-3 text-base">
        <input
          placeholder="Buscar por nombre, correo o teléfono…"
          className="min-w-[260px] flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-base outline-none focus:border-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla de clientes */}
      {filteredCustomers.length === 0 ? (
        <p className="text-base text-muted-foreground">
          No hay clientes que coincidan con la búsqueda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
          <table className="min-w-full text-left text-base">
            <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Contacto</th>
                <th className="px-5 py-3 hidden md:table-cell">
                  Registrado
                </th>
                <th className="px-5 py-3">Órdenes</th>
                <th className="px-5 py-3">Total gastado</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-border/70 hover:bg-muted/60"
                >
                  <td className="px-5 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {c.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ID: {c.id}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">
                        {c.email}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {c.phone || "Sin teléfono"}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3 hidden md:table-cell text-sm text-muted-foreground">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString(
                          "es-CL"
                        )
                      : "Sin fecha"}
                  </td>

                  <td className="px-5 py-3">
                    <span className="text-base font-semibold">
                      {c.ordersCount ?? 0}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <span className="text-base font-semibold">
                      {currencyCLP.format(c.totalSpent ?? 0)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
