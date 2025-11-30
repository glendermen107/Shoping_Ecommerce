// web/app/admin/orders/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order } from "../../../lib/types";

const STORAGE_KEY = "adminOrders";

const currencyCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

// Datos de ejemplo para inicializar (si no hay nada en localStorage)
const initialOrders: Order[] = [
  {
    id: "ORD-0001",
    customerId: "CUST-001",
    customerName: "María González",
    customerEmail: "maria@example.com",
    customerPhone: "+56 9 1234 5678",
    total: 25990,
    status: "paid",
    createdAt: new Date().toISOString(),
    items: [
      {
        productId: "prod-1",
        name: "Detergente multiuso",
        quantity: 2,
        price: 7990,
      },
      {
        productId: "prod-2",
        name: "Desinfectante pisos",
        quantity: 1,
        price: 10010,
      },
    ],
  },
  {
    id: "ORD-0002",
    customerId: "CUST-002",
    customerName: "Juan Pérez",
    customerEmail: "juan@example.com",
    customerPhone: "+56 9 8765 4321",
    total: 15990,
    status: "pending",
    createdAt: new Date().toISOString(),
    items: [
      {
        productId: "prod-3",
        name: "Limpia vidrios",
        quantity: 3,
        price: 5330,
      },
    ],
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Order["status"]>(
    "all"
  );

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ──────────────── CARGA INICIAL ────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        setOrders(parsed);
      } else {
        // Primera vez: usa data de ejemplo
        setOrders(initialOrders);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
      }
    } catch (err) {
      console.error("Error cargando órdenes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveOrders = (next: Order[]) => {
    setOrders(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  // ──────────────── FILTROS ────────────────
  const filteredOrders = useMemo(() => {
    const text = search.trim().toLowerCase();

    return orders
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .filter((order) => {
        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;

        const matchesText =
          !text ||
          order.id.toLowerCase().includes(text) ||
          order.customerName.toLowerCase().includes(text) ||
          order.customerEmail.toLowerCase().includes(text);

        return matchesStatus && matchesText;
      });
  }, [orders, search, statusFilter]);

  const updateStatus = (id: string, status: Order["status"]) => {
    const next = orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    saveOrders(next);
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "Pendiente",
          className: "bg-amber-100 text-amber-800",
        };
      case "paid":
        return {
          label: "Pagada",
          className: "bg-emerald-100 text-emerald-800",
        };
      case "shipped":
        return {
          label: "Despachada",
          className: "bg-blue-100 text-blue-800",
        };
      case "cancelled":
        return {
          label: "Cancelada",
          className: "bg-neutral-200 text-neutral-800",
        };
    }
  };

  if (loading) {
    return (
      <p className="text-base text-muted-foreground">
        Cargando órdenes…
      </p>
    );
  }

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Órdenes
          </h2>
          <p className="text-base text-foreground">
            Revisa las compras realizadas por los clientes.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 text-base">
        <input
          placeholder="Buscar por N° de orden, nombre o correo…"
          className="min-w-[260px] flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-base outline-none focus:border-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className="rounded-full border border-border bg-background px-4 py-2.5 text-base outline-none focus:border-emerald-500"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="paid">Pagada</option>
          <option value="shipped">Despachada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      {/* Tabla */}
      {filteredOrders.length === 0 ? (
        <p className="text-base text-muted-foreground">
          No hay órdenes que coincidan con el filtro.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
          <table className="min-w-full text-left text-base">
            <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3">N° Orden</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3 hidden md:table-cell">
                  Contacto
                </th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 hidden md:table-cell">
                  Fecha
                </th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);

                return (
                  <tr
                    key={order.id}
                    className="border-t border-border/70 hover:bg-muted/60"
                  >
                    <td className="px-5 py-3 font-semibold">
                      {order.id}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {order.customerName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {order.customerEmail}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3 hidden md:table-cell text-sm text-muted-foreground">
                      {order.customerPhone || "Sin teléfono"}
                    </td>

                    <td className="px-5 py-3 font-semibold">
                      {currencyCLP.format(order.total)}
                    </td>

                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    <td className="px-5 py-3 hidden md:table-cell text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("es-CL", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-full border border-border px-4 py-1.5 text-sm hover:border-emerald-500 hover:text-emerald-700"
                        >
                          Ver detalle
                        </button>

                        {order.status !== "cancelled" && (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(
                                order.id,
                                e.target.value as Order["status"]
                              )
                            }
                            className="rounded-full border border-border bg-background px-3 py-1.5 text-sm outline-none hover:border-emerald-500"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="paid">Pagada</option>
                            <option value="shipped">Despachada</option>
                            <option value="cancelled">Cancelada</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal detalle de orden */}
      {selectedOrder && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl rounded-3xl border border-border bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Detalle orden {selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-full border border-border px-3 py-1 text-sm hover:bg-muted"
              >
                Cerrar
              </button>
            </div>

            <div className="mb-4 space-y-1 text-base">
              <p>
                <span className="font-medium">Cliente:</span>{" "}
                {selectedOrder.customerName}
              </p>
              <p>
                <span className="font-medium">Correo:</span>{" "}
                {selectedOrder.customerEmail}
              </p>
              <p>
                <span className="font-medium">Teléfono:</span>{" "}
                {selectedOrder.customerPhone || "Sin teléfono"}
              </p>
              <p>
                <span className="font-medium">Fecha:</span>{" "}
                {new Date(
                  selectedOrder.createdAt
                ).toLocaleString("es-CL", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <div className="mb-4 rounded-2xl border border-border bg-card">
              <table className="min-w-full text-left text-base">
                <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2">Producto</th>
                    <th className="px-4 py-2 text-center">Cantidad</th>
                    <th className="px-4 py-2 text-right">Precio</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.productId} className="border-t border-border/70">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {currencyCLP.format(item.price)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {currencyCLP.format(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-4 text-lg font-semibold">
              <span>Total:</span>
              <span>{currencyCLP.format(selectedOrder.total)}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
