// web/components/offersCarousel.tsx
"use client";

import { useRef } from "react";
import type { Product } from "../lib/types";
import ProductCard from "./productCard";

type OffersCarouselProps = {
  products: Product[];
  title?: string;
  subtitle?: string;
};

export default function OffersCarousel({
  products,
  title = "Ofertas y productos destacados",
  subtitle = "Selección especial de productos en oferta o destacados.",
}: OffersCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild
      ? (container.firstElementChild as HTMLElement).clientWidth
      : 260;

    const amount = cardWidth * 1.2;

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!products.length) return null;

  return (
    <section className="space-y-3">
      {/* Título + controles */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-emerald-800">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy("left")}
            className="h-8 w-8 rounded-full border border-emerald-300 bg-white text-emerald-700 text-sm hover:bg-emerald-50 transition"
            aria-label="Desplazar a la izquierda"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy("right")}
            className="h-8 w-8 rounded-full border border-emerald-300 bg-white text-emerald-700 text-sm hover:bg-emerald-50 transition"
            aria-label="Desplazar a la derecha"
          >
            ›
          </button>
        </div>
      </div>

      {/* Carrusel horizontal */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="min-w-[230px] max-w-xs snap-start flex-shrink-0"
          >
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
