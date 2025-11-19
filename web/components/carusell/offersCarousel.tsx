// web/components/offersCarousel.tsx
"use client";

import { useEffect, useState } from "react";
import type { Product } from "../../lib/types";
import ProductCard from "../products/productCard";

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
  const visibleCount = 3;
  const enableCarousel = products.length > visibleCount;

  const [index, setIndex] = useState(0);

  const maxIndex = enableCarousel ? products.length - visibleCount : 0;

  const handleNext = () => {
    if (!enableCarousel) return;
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    if (!enableCarousel) return;
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-slide cada 5 segundos
  useEffect(() => {
    if (!enableCarousel) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(id);
  }, [enableCarousel, maxIndex]);

  if (!products.length) return null;

  // Cada paso mueve 1/visibleCount del ancho total
  const offsetPercent = enableCarousel ? (index * 100) / visibleCount : 0;

  return (
    <section className="space-y-3">
      {/* Título + controles */}
      <div className="flex items-center justify-between gap-2 max-w-6xl mx-auto">
        <div>
          <h2 className="text-lg font-semibold text-emerald-500">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="h-8 w-8 rounded-full border border-emerald-400 bg-white text-emerald-500 text-sm hover:bg-emerald-500 hover:text-white transition"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="h-8 w-8 rounded-full border border-emerald-400 bg-white text-emerald-500 text-sm hover:bg-emerald-500 hover:text-white transition"
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>

      {/* Carrusel: 3 visibles, mueve de a 1 */}
      <div className="relative max-w-6xl mx-auto">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${offsetPercent}%)`,
            }}
          >
            {products.map((p) => (
              <div
                key={p.id}
                className="basis-1/3 flex-shrink-0 pr-4"
              >
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
