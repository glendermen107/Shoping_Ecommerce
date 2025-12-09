// web/app/catalogo/page.tsx
import ProductGrid from "../../components/products/productGrid";
import OffersCarousel from "../../components/carousel/offersCarousel";

import { getProducts } from "../../lib/productsApi";
import { getCategories } from "../../lib/categoriesApi";
import type { Product } from "../../lib/types";
import type { Category } from "../../lib/categoriesApi";

import CatalogFilters from "../catalogo/catalogoFilters";

type CatalogoPageProps = {
  searchParams?: {
    q?: string;
    cat?: string;
    featured?: string;
    onSale?: string;
    minPrice?: string;
    maxPrice?: string;
  };
};

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  // Parámetros de búsqueda DESDE LA URL
  const search = searchParams?.q?.toLowerCase() ?? "";
  const categorySlug = searchParams?.cat ?? "";
  const onlyFeatured = searchParams?.featured === "1";
  const onlyOnSale = searchParams?.onSale === "1";

  const minPrice = searchParams?.minPrice
    ? Number(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams?.maxPrice
    ? Number(searchParams.maxPrice)
    : undefined;

  // 🔥 Obtener productos y categorías desde tu API nueva
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Max price global (para slider)
  const prices = products.map((p: Product) => Number(p.price) || 0);
  const globalMaxPrice = prices.length > 0 ? Math.max(...prices) : 10000;

  // ------------------------
  // FILTRADO DE PRODUCTOS (para el GRID)
  // ------------------------
  const filteredProducts = products.filter((product: Product) => {
    const name = product.name.toLowerCase();
    const price = Number(product.price) || 0;

    const matchesSearch = search ? name.includes(search) : true;
    const matchesCategory = categorySlug
      ? product.category?.slug === categorySlug
      : true;
    const matchesFeatured = onlyFeatured ? !!product.isFeatured : true;
    const matchesOnSale = onlyOnSale ? !!product.isOnSale : true;

    const matchesMinPrice =
      typeof minPrice === "number" && !Number.isNaN(minPrice)
        ? price >= minPrice
        : true;

    const matchesMaxPrice =
      typeof maxPrice === "number" && !Number.isNaN(maxPrice)
        ? price <= maxPrice
        : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesFeatured &&
      matchesOnSale &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  const totalCount = filteredProducts.length;

  // ------------------------
  // DESTACADOS PARA EL CARRUSEL
  // 👉 AHORA SIEMPRE DESDE TODOS LOS PRODUCTOS,
  //    NO DESDE LOS FILTRADOS
  // ------------------------
  let featuredProducts = products.filter((p: Product) => p.isFeatured);
  if (featuredProducts.length === 0) {
    featuredProducts = products.slice(0, 4);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Encabezado */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Catálogo</h1>
        <p className="text-base text-foreground">
          Explora nuestra selección de productos de limpieza.
        </p>
      </header>

      <div className="mt-2 flex flex-col gap-6 md:flex-row">
        {/* SIDEBAR */}
        <aside
          className="
            hidden md:block
            w-64
            rounded-3xl border border-emerald-200 bg-emerald-50
            p-5 space-y-6 text-sm shadow-md text-emerald-900
            sticky top-24
            max-h-[90vh]
            overflow-y-auto
          "
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Filtros
            </p>
            <p className="text-xs">
              Ajusta los filtros para encontrar el producto ideal.
            </p>
          </div>

          {/* 🔹 COMPONENTE CLIENTE QUE AUTO-APLICA LOS FILTROS */}
          <CatalogFilters
            categories={categories as Category[]}
            initialSearch={searchParams?.q ?? ""}
            categorySlug={categorySlug}
            onlyFeatured={onlyFeatured}
            onlyOnSale={onlyOnSale}
            maxPrice={maxPrice}
            globalMaxPrice={globalMaxPrice}
          />
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1 space-y-6">
          {/* “Footer” informativo arriba del listado, se actualiza solo */}
          <p className="text-sm text-muted-foreground">
            {totalCount === 0
              ? "No se encontraron productos."
              : `Mostrando ${totalCount} producto${
                  totalCount === 1 ? "" : "s"
                } con los filtros actuales.`}
          </p>

          {/* Carrusel de destacados → NO depende de los filtros */}
          {featuredProducts.length > 0 && (
            <OffersCarousel
              products={featuredProducts}
              title="Ofertas y destacados"
              subtitle="Selección especial para ti"
            />
          )}

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Productos disponibles
            </h2>

            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </section>
  );
}
