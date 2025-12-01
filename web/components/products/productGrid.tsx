// web/components/products/productGrid.tsx
import type { Product } from "../../lib/types";
import ProductCard from "./productCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products?.length)
    return (
      <p className="text-base text-muted-foreground">
        No hay productos.
      </p>
    );

  return (
    <div
      className="
        grid gap-6
        grid-cols-1           /* móvil */
        sm:grid-cols-2        /* ≥ 640px */
        lg:grid-cols-3        /* ≥ 1024px */
        xl:grid-cols-4        /* ≥ 1280px */
      "
    >
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
