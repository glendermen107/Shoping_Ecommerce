// web/app/profile/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/auth/authContext";
import { useEffect, useState } from "react";

// Enmascara el correo para mayor privacidad
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  if (local.length <= 2) {
    return `${"*".repeat(local.length)}@${domain}`;
  }

  const visible = local.slice(0, 2);
  const masked = "*".repeat(Math.max(local.length - 2, 2));
  return `${visible}${masked}@${domain}`;
}

// Tipo simple para los pedidos recientes (resumen)
type LocalOrderSummary = {
  id: string;
  date: string;
  totalAmount: number;
  status: string;
};

// formato CLP
const currencyCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Estados para dirección
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  // Pedidos recientes
  const [recentOrders, setRecentOrders] = useState<LocalOrderSummary[]>([]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push("/auth/login");
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí más adelante puedes llamar a tu API (Nest) para guardar la dirección
    setSavedMessage("Dirección guardada para futuros envíos.");
    setTimeout(() => setSavedMessage(""), 2500);
  };

  // Cargar pedidos recientes desde localStorage (stub para ahora)
  useEffect(() => {
    if (!user) return;
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem("orders");
      if (!raw) {
        setRecentOrders([]);
        return;
      }

      const allOrders = JSON.parse(raw) as any[];

      // Intentamos filtrar por userId o email
      const userOrders = allOrders.filter(
        (o) => o.userId === user.id || o.email === user.email
      );

      const mapped: LocalOrderSummary[] = userOrders
        .sort((a, b) => {
          const da = new Date(a.createdAt ?? a.date ?? 0).getTime();
          const db = new Date(b.createdAt ?? b.date ?? 0).getTime();
          return db - da;
        })
        .slice(0, 3)
        .map((o) => ({
          id: o.id?.toString() ?? o.orderId?.toString() ?? "s/n",
          date: o.createdAt ?? o.date ?? new Date().toISOString(),
          totalAmount: Number(o.totalAmount ?? o.total ?? 0),
          status: o.status ?? "Pendiente",
        }));

      setRecentOrders(mapped);
    } catch (err) {
      console.error("Error leyendo pedidos desde localStorage:", err);
      setRecentOrders([]);
    }
  }, [user]);

  // Si no hay usuario logueado
  if (!user) {
    return (
      <section className="mx-auto flex max-w-md flex-col gap-4 rounded-3xl border border-border bg-card px-6 py-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">
          Debes iniciar sesión
        </h1>
        <p className="text-base text-muted-foreground">
          Para ver tu perfil y el estado de tus pedidos, inicia sesión en tu cuenta.
        </p>

        <Link
          href="/auth/login"
          className="mt-2 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
        >
          Ir a iniciar sesión
        </Link>
      </section>
    );
  }

  const maskedEmail = maskEmail(user.email ?? "");

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Encabezado */}
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-foreground">Mi cuenta</h1>
        <p className="text-base text-muted-foreground">
          Revisa tus datos personales, tu dirección de envío y tus pedidos recientes.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
        {/* Columna izquierda: perfil + dirección */}
        <div className="space-y-4">
          {/* Card datos usuario */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Bienvenido(a)
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {user.name ?? "Usuario"}
              </p>
            </div>

            <div className="space-y-2 text-base">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Correo electrónico
                </p>
                <p className="text-base text-foreground tracking-wide">
                  {maskedEmail}
                </p>
                <p className="text-xs text-muted-foreground">
                  Mostramos solo parte del correo por seguridad.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-2xl border border-rose-300 bg-rose-50 px-5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Card dirección de envío */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                Dirección de envío
              </h2>
              <p className="text-sm text-muted-foreground">
                Guarda una dirección para facilitar tus próximos pedidos.
              </p>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-base">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">
                  Dirección
                </label>
                <input
                  className="
                    w-full rounded-2xl border border-border bg-white
                    px-3 py-2.5 text-base text-foreground
                    placeholder:text-muted-foreground
                    outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
                  "
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Calle 1234, depto. 201"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-foreground">
                    Ciudad / Comuna
                  </label>
                  <input
                    className="
                      w-full rounded-2xl border border-border bg-white
                      px-3 py-2.5 text-base text-foreground
                      placeholder:text-muted-foreground
                      outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
                    "
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej: La Florida"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-foreground">
                    Región
                  </label>
                  <input
                    className="
                      w-full rounded-2xl border border-border bg-white
                      px-3 py-2.5 text-base text-foreground
                      placeholder:text-muted-foreground
                      outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
                    "
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Ej: Región Metropolitana"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="
                  mt-2 inline-flex items-center justify-center rounded-2xl
                  bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white
                  hover:bg-emerald-500
                "
              >
                Guardar dirección
              </button>

              {savedMessage && (
                <p className="text-sm text-emerald-700 pt-1">{savedMessage}</p>
              )}
            </form>
          </div>
        </div>

        {/* Columna derecha: pedidos recientes */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Pedidos recientes
          </h2>
          {recentOrders.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Aún no tienes pedidos registrados.
              </p>
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Ver catálogo y hacer mi primera compra
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Estos son tus últimos pedidos:
              </p>
              <ul className="space-y-3 text-sm">
                {recentOrders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between rounded-2xl border border-border px-4 py-2.5"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        Pedido #{order.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.date).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-semibold text-emerald-700">
                        {currencyCLP.format(order.totalAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Estado: {order.status}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                href="/orders"
                className="inline-flex items-center justify-center rounded-2xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-emerald-500 hover:text-emerald-700"
              >
                Ver todos mis pedidos
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
