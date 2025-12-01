// web/app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../components/cart/cartContext";
import { useAuth } from "../../components/auth/authContext";

const currencyCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

type ShippingMethod = "pickup" | "delivery";

type LocalOrder = {
  id: string;
  userId: string;
  email: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: string;
  shippingMethod: string;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clear } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("pickup");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si no hay usuario → sugerimos ir a login
  useEffect(() => {
    // no redirijo de inmediato para que vea el mensaje
  }, [isAuthenticated]);

  // Si no hay productos en el carrito
  if (!items || items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          No tienes productos en el carrito
        </h1>
        <p className="text-base text-muted-foreground">
          Agrega algunos productos antes de continuar al pago.
        </p>
        <Link
          href="/catalogo"
          className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
        >
          Ir al catálogo
        </Link>
      </section>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!isAuthenticated || !user) {
    setError("Debes iniciar sesión para confirmar tu pedido.");
    return;
  }

  if (shippingMethod === "delivery") {
    if (!address.trim() || !city.trim() || !region.trim()) {
      setError("Para envío a domicilio debes completar todos los datos de dirección.");
      return;
    }
  }

  setIsSubmitting(true);

  try {
    const now = new Date();
    const shippingAddress =
      shippingMethod === "pickup"
        ? "Retiro en tienda - dirección se coordina con el vendedor."
        : `${address.trim()}, ${city.trim()}, ${region.trim()}`;

    const order: LocalOrder = {
      id: crypto.randomUUID(),
      userId: user.id,
      email: user.email,
      items: items.map((it) => ({
        productId: it.productId,
        name: it.name,
        quantity: it.quantity,
        price: it.price,
      })),
      totalAmount,
      status: "Pendiente de pago",
      shippingMethod:
        shippingMethod === "pickup" ? "Retiro en tienda" : "Envío a domicilio",
      shippingAddress,
      notes: notes.trim() || undefined,
      createdAt: now.toISOString(),
    };

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("orders");
      const existing: LocalOrder[] = raw ? JSON.parse(raw) : [];
      existing.push(order);
      window.localStorage.setItem("orders", JSON.stringify(existing));
    }

    // Vaciar carrito
    clear();

    // 🌟 Mensaje de confirmación + redirección a la cuenta
    alert(
      "Tu orden de compra se generó correctamente. Puedes revisarla en tu cuenta en la sección de pedidos."
    );
    // Como ya está logueado, lo mandamos a su cuenta
      router.push("/profile");
    } catch (err) {
      console.error("Error al generar la orden:", err);
      setError("Ocurrió un error al generar tu orden. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-foreground">
          Confirmar pedido
        </h1>
        <p className="text-base text-muted-foreground">
          Revisa tus productos, elige el tipo de entrega y genera tu orden de compra.
        </p>
      </header>

      {/* Aviso si no está logueado */}
      {!isAuthenticated && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Debes iniciar sesión para completar el pedido.{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Iniciar sesión
          </Link>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
        {/* Columna izquierda: formulario de entrega */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Tipo de entrega
            </h2>
            <p className="text-sm text-muted-foreground">
              Elige si quieres retirar en tienda o recibir el pedido en tu domicilio.
            </p>
          </div>

          {/* Radios de tipo de entrega */}
          <div className="space-y-3 text-base">
            <label className="flex items-start gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground">
              <input
                type="radio"
                name="shippingMethod"
                value="pickup"
                checked={shippingMethod === "pickup"}
                onChange={() => setShippingMethod("pickup")}
                className="mt-[2px] h-4 w-4"
              />
              <div>
                <p className="font-semibold">Retiro en tienda</p>
                <p className="text-xs text-muted-foreground">
                  Coordinaremos el lugar y horario exacto una vez confirmada la orden.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground">
              <input
                type="radio"
                name="shippingMethod"
                value="delivery"
                checked={shippingMethod === "delivery"}
                onChange={() => setShippingMethod("delivery")}
                className="mt-[2px] h-4 w-4"
              />
              <div>
                <p className="font-semibold">Envío a domicilio</p>
                <p className="text-xs text-muted-foreground">
                  Ingresas tu dirección y calculamos el despacho al coordinar el pedido.
                </p>
              </div>
            </label>
          </div>

          {/* Dirección solo si es envío */}
          {shippingMethod === "delivery" && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-foreground">
                Dirección de envío
              </h3>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">
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
                  <label className="block text-xs font-medium text-foreground">
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
                  <label className="block text-xs font-medium text-foreground">
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
            </div>
          )}

          {/* Notas opcionales */}
          <div className="space-y-1 pt-2">
            <label className="block text-xs font-medium text-foreground">
              Notas para el pedido (opcional)
            </label>
            <textarea
              className="
                w-full rounded-2xl border border-border bg-white
                px-3 py-2.5 text-sm text-foreground
                placeholder:text-muted-foreground
                outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
              "
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Referencias para llegar, horarios preferidos, etc."
            />
          </div>

          {/* Botón confirmar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isAuthenticated}
              className="
                inline-flex items-center justify-center rounded-2xl
                bg-emerald-600 px-8 py-2.5 text-base font-semibold text-white
                hover:bg-emerald-500
                disabled:cursor-not-allowed disabled:opacity-70
              "
            >
              {isSubmitting ? "Generando orden..." : "Generar orden de compra"}
            </button>
          </div>
        </form>

        {/* Columna derecha: resumen del pedido */}
        <aside className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            Resumen del pedido
          </h2>

          <ul className="space-y-3 text-sm">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white px-3 py-2"
              >
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-emerald-700">
                  {currencyCLP.format(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-3 space-y-1">
            <p className="flex items-center justify-between text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{currencyCLP.format(totalAmount)}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              El costo de despacho se coordina y confirma posteriormente.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
