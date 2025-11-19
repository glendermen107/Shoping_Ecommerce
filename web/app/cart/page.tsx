// web/app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartTotals,
} from "../../lib/cart";
import type { CartItem } from "../../lib/types";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedCart = updateQuantity(productId, quantity);
    setCartItems(updatedCart);
  };

  const handleRemove = (productId: string) => {
    const updatedCart = removeFromCart(productId);
    setCartItems(updatedCart);
  };

  const handleClear = () => {
    clearCart();
    setCartItems([]);
  };

  const { totalQuantity, totalAmount } = getCartTotals(cartItems);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Carrito</h1>

      {!cartItems.length ? (
        <p>
          Tu carrito está vacío.{" "}
          <Link href="/catalog" className="underline text-emerald-700">
            Ver catálogo
          </Link>
        </p>
      ) : (
        <>
          <ul className="space-y-3">
            {cartItems.map((item) => (
              <li
                key={item.productId}
                className="flex items-center justify-between rounded-lg border border-emerald-100 bg-white/90 p-3 shadow-sm"
              >
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-sm text-neutral-500">
                    ${item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* cantidad: ahora visible en modo claro */}
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
                    className="
                      w-16 rounded-md border border-emerald-200 bg-white
                      px-2 py-1 text-sm text-slate-800
                      outline-none focus:border-emerald-500
                    "
                  />

                  {/* botón Eliminar con hover rojo suave */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.productId)}
                    className="
                      text-xs font-medium text-rose-500
                      rounded-md px-2 py-1
                      hover:text-rose-700 hover:bg-rose-50
                      transition
                    "
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-emerald-100 pt-4">
            <div>
              <p className="text-lg text-slate-800">
                Subtotal:{" "}
                <b>${totalAmount.toLocaleString()}</b>
              </p>
              <p className="text-sm text-neutral-500">
                {totalQuantity} ítem{totalQuantity !== 1 && "s"}
              </p>
            </div>

            <div className="flex gap-2">
              {/* Vaciar carrito */}
              <button
                type="button"
                onClick={handleClear}
                className="
                  rounded-full border border-rose-300
                  px-4 py-2 text-sm font-medium
                  text-rose-600
                  hover:bg-rose-50 hover:border-rose-400 hover:text-rose-700
                  transition
                "
              >
                Vaciar carrito
              </button>

              {/* Ir al pago */}
              <Link
                href="/checkout"
                className="
                  rounded-full bg-emerald-600
                  px-5 py-2 text-sm font-medium
                  text-white
                  hover:bg-emerald-500 hover:shadow-md
                  transition
                "
              >
                Ir al pago
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
