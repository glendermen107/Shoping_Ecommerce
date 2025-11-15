import Link from "next/link";
import type { Product } from "../lib/types";
import AddToCartButton from "./addToCartButton";

function formatPriceCLP(value: number) {
  if (Number.isNaN(value)) return "$0";
  return value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

export default function ProductCard({ p }: { p: Product }) {
  const shortDescription = p.description
    ? p.description.length > 80
      ? p.description.slice(0, 77) + "..."
      : p.description
    : "Producto de limpieza.";

  // Si en el futuro agregas stock:
  const stockText =
    typeof p.stock === "number"
      ? p.stock > 0
        ? `Stock: ${p.stock} unidad${p.stock === 1 ? "" : "es"}`
        : "Sin stock"
      : undefined;

  return (
    <article className="flex flex-col rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition">
      {/* Imagen */}
      <Link href={`/product/${p.slug}`} className="block overflow-hidden rounded-t-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.imageUrl || "/placeholder.png"}
          alt={p.name}
          className="h-48 w-full object-cover transition-transform duration-200 hover:scale-[1.03]"
        />
      </Link>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Nombre y (opcional) categoría */}
        <div>
          <Link
            href={`/product/${p.slug}`}
            className="block hover:underline"
          >
            <h3 className="font-medium text-sm md:text-base">{p.name}</h3>
          </Link>
          {p.categoryName && (
            <p className="text-xs text-neutral-500">{p.categoryName}</p>
          )}
        </div>

        {/* Descripción corta */}
        <p className="text-xs text-neutral-500">{shortDescription}</p>

        {/* Precio + info de despacho / stock */}
        <div className="mt-auto flex items-baseline justify-between gap-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-neutral-900">
              {formatPriceCLP(p.price)}
            </p>
            <p className="text-[11px] text-neutral-500">
              Despacho disponible. Sobre $50.000 en productos, envío gratis.
            </p>
            {stockText && (
              <p className="text-[11px] text-neutral-500">{stockText}</p>
            )}
          </div>

          {/* Botón agregar al carrito */}
          <div className="flex-shrink-0">
            <AddToCartButton product={p} />
          </div>
        </div>
      </div>
    </article>
  );
}
