// web/app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, updateQuantity, removeFromCart, clearCart, getCartTotals } from "../../lib/cart";
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
          <Link href="/catalog" className="underline">
            Ver catálogo
          </Link>
        </p>
      ) : (
        <>
          <ul className="space-y-3">
            {cartItems.map((item) => (
              <li
                key={item.productId}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-neutral-400">
                    ${item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
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
                    className="w-16 rounded border px-2 py-1 bg-black"
                  />
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-lg">
                Subtotal:{" "}
                <b>${totalAmount.toLocaleString()}</b>{" "}
              </p>
              <p className="text-sm text-neutral-400">
                {totalQuantity} ítem{totalQuantity !== 1 && "s"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Vaciar carrito
              </button>
              <Link
                href="/checkout"
                className="rounded-md border px-4 py-2 text-sm bg-white text-black"
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
