// web/app/cart/page.tsx
"use client";

import Link from "next/link";
import { useCart } from "../../components/cart/cartContext";

function formatPriceCLP(value: number) {
  if (Number.isNaN(value)) return "$0";
  return value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

export default function CartPage() {
  const {
    items,
    totalQuantity,
    subtotal,
    taxes,
    totalAmount,
    isLoading,
    updateItemQuantity,
    removeItem,
    clear,
  } = useCart();

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    updateItemQuantity(productId, quantity);
  };

  const handleRemove = (productId: number) => {
    removeItem(productId);
  };

  const handleClear = () => {
    if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      clear();
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-emerald-400">
          Carrito de Compras
        </h1>
        {isLoading && (
          <span className="text-sm text-slate-400">Cargando...</span>
        )}
      </div>

      {!items.length ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-slate-300">Tu carrito está vacío.</p>
          <Link
            href="/catalogo"
            className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <>
          {/* Lista de productos */}
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center gap-4 rounded-lg border border-emerald-100 bg-white/90 p-4 shadow-sm"
              >
                {/* Imagen del producto */}
                {item.imageUrl && (
                  <div className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  </div>
                )}

                {/* Información del producto */}
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-sm text-neutral-500">
                    Precio unitario: {formatPriceCLP(item.price)}
                  </p>
                  <p className="text-sm text-emerald-600 font-semibold mt-1">
                    Subtotal: {formatPriceCLP(item.total)}
                  </p>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1 || isLoading}
                      className="
                        h-8 w-8 rounded-md border border-emerald-200 bg-white
                        text-emerald-600 font-semibold
                        hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed
                        transition
                      "
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        handleQuantityChange(
                          item.productId,
                          Number(event.target.value)
                        )
                      }
                      disabled={isLoading}
                      className="
                        w-16 rounded-md border border-emerald-200 bg-white
                        px-2 py-1 text-center text-sm text-slate-800
                        outline-none focus:border-emerald-500
                        disabled:opacity-40
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
                      disabled={isLoading}
                      className="
                        h-8 w-8 rounded-md border border-emerald-200 bg-white
                        text-emerald-600 font-semibold
                        hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed
                        transition
                      "
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.productId)}
                    disabled={isLoading}
                    className="
                      rounded-md px-3 py-1.5 text-xs font-medium text-rose-500
                      hover:bg-rose-50 hover:text-rose-700
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition
                    "
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Resumen del carrito */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-6 space-y-3">
            <h2 className="text-lg font-semibold text-slate-800">
              Resumen del pedido
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalQuantity} productos):</span>
                <span className="font-medium">{formatPriceCLP(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>IVA (10%):</span>
                <span className="font-medium">{formatPriceCLP(taxes)}</span>
              </div>

              <div className="border-t border-emerald-200 pt-2 flex justify-between text-lg font-semibold text-slate-800">
                <span>Total:</span>
                <span className="text-emerald-600">
                  {formatPriceCLP(totalAmount)}
                </span>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <Link
                href="/checkout"
                className="
                  block w-full text-center
                  rounded-full bg-emerald-600
                  px-5 py-3 text-sm font-semibold text-white
                  hover:bg-emerald-500 hover:shadow-md
                  transition
                "
              >
                Proceder al pago
              </Link>

              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="
                  block w-full text-center
                  rounded-full border border-rose-300
                  px-4 py-2 text-sm font-medium text-rose-600
                  hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition
                "
              >
                Vaciar carrito
              </button>

              <Link
                href="/catalogo"
                className="
                  block w-full text-center
                  px-4 py-2 text-sm text-emerald-700
                  hover:text-emerald-600
                  transition
                "
              >
                ← Continuar comprando
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
