// web/components/addToCartButton.tsx
"use client";

import { useState } from "react";
import type { Product } from "../lib/types";
import { addToCart } from "../lib/cart";

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = () => {
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAdding}
      className="rounded-md border px-4 py-2 hover:bg-white hover:text-black transition"
    >
      {isAdding ? "Agregando..." : "Agregar al carrito"}
    </button>
  );
}
