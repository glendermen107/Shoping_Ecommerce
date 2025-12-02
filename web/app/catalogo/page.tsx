// web/app/catalogo/page.tsx
import ProductGrid from "../../components/products/productGrid";
import OffersCarousel from "../../components/carousel/offersCarousel";
import PriceRangeFilter from "../../components/carousel/priceRangeFilter";

import { getProducts } from "../../lib/productsApi";
import { getCategories } from "../../lib/categoriesApi";
import type { Product } from "../../lib/types";
import type { Category } from "../../lib/categoriesApi";

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
  // Parámetros de búsqueda
  const search = searchParams?.q?.toLowerCase() ?? "";
  const categorySlug = searchParams?.cat ?? "";
  const onlyFeatured = searchParams?.featured === "1";
  const onlyOnSale = searchParams?.onSale === "1";

  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;

  // 🔥 Obtener productos y categorías desde tu API nueva
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  // Max price global (para slider)
  const prices = products.map((p: Product) => Number(p.price) || 0);
  const globalMaxPrice = prices.length > 0 ? Math.max(...prices) : 10000;

  // ------------------------
  // FILTRADO DE PRODUCTOS
  // ------------------------
  const filteredProducts = products.filter((product: Product) => {
    const name = product.name.toLowerCase();
    const price = Number(product.price) || 0;

    const matchesSearch = search ? name.includes(search) : true;
    const matchesCategory = categorySlug ? product.category?.slug === categorySlug : true;
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

  // Destacados → carrusel
  let featuredProducts = filteredProducts.filter((p: Product) => p.isFeatured);
  if (featuredProducts.length === 0) {
    featuredProducts = filteredProducts.slice(0, 4);
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

          <form action="/catalogo" className="space-y-5">
            {/* BUSCAR */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-emerald-800">Buscar</p>
              <input
                type="text"
                name="q"
                defaultValue={searchParams?.q ?? ""}
                placeholder="Ej: cloro..."
                className="
                  w-full rounded-full border border-emerald-200 bg-white 
                  px-3 py-2 text-sm 
                  placeholder:text-emerald-600
                  outline-none focus:border-emerald-500
                "
              />
            </div>

            <hr className="border-emerald-200" />

            {/* CATEGORÍAS DINÁMICAS */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-emerald-800">Categoría</p>

              <div className="flex flex-col gap-2 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cat"
                    value=""
                    defaultChecked={!categorySlug}
                    className="h-4 w-4 text-emerald-600"
                  />
                  Todos
                </label>

                {categories.map((cat: Category) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cat"
                      value={cat.slug}
                      defaultChecked={categorySlug === cat.slug}
                      className="h-4 w-4 text-emerald-600"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-emerald-200" />

            {/* TIPO */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-emerald-800">Tipo de producto</p>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  value="1"
                  defaultChecked={onlyFeatured}
                  className="h-4 w-4 text-emerald-600"
                />
                Solo destacados
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="onSale"
                  value="1"
                  defaultChecked={onlyOnSale}
                  className="h-4 w-4 text-emerald-600"
                />
                Solo en oferta
              </label>
            </div>

            <hr className="border-emerald-200" />

            {/* PRECIO */}
            <PriceRangeFilter
              maxLimit={globalMaxPrice}
              initialMaxPrice={maxPrice}
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="
                  rounded-full bg-emerald-600
                  px-4 py-2 text-xs font-semibold text-white
                  hover:bg-emerald-500 transition
                "
              >
                Aplicar filtros
              </button>

              <a
                href="/catalogo"
                className="text-xs text-emerald-700 hover:text-emerald-900"
              >
                Limpiar
              </a>
            </div>
          </form>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1 space-y-6">
          <p className="text-sm text-muted-foreground">
            {totalCount === 0
              ? "No se encontraron productos."
              : `Mostrando ${totalCount} producto${totalCount === 1 ? "" : "s"}`}
          </p>

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
