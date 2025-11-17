// web/app/catalog/page.tsx
import ProductGrid from "../../components/productGrid";
import { fetchProducts } from "../../lib/api";
import OffersCarousel from "../../components/offersCarousel";


type CatalogPageProps = {
  searchParams?: {
    q?: string;
    cat?: string;
  };
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const search = searchParams?.q?.toLowerCase() ?? "";
  const category = searchParams?.cat?.toLowerCase() ?? "";

  // Traemos todos los productos desde la API (o mocks si falla)
  const products = await fetchProducts();

  // Filtro por texto (buscador) + categoría “lógica” (por nombre)
  const filteredProducts = products.filter((product) => {
    const name = product.name.toLowerCase();
    const matchesSearch = search ? name.includes(search) : true;
    const matchesCategory = category ? name.includes(category) : true;
    return matchesSearch && matchesCategory;
  });

  const totalCount = filteredProducts.length;
  const featuredProducts = filteredProducts.slice(0, 4);

  return (
    
    <section className="space-y-8">
      {/* Encabezado + promo de despacho */}
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold">Catálogo</h1>
        <p className="text-neutral-300 text-sm">
          Explora nuestros productos de limpieza para hogar y empresas. 
          Todos los precios incluyen información clara de formato y presentación.
        </p>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-sm">
          <p className="font-medium">
            🛻 Despacho gratis sobre $50.000 en productos.
          </p>
          <p className="text-neutral-400 text-xs">
            Válido para comunas seleccionadas. El costo de envío se confirma al
            momento de coordinar el pedido.
          </p>
        </div>
      </header>

      {/* Buscador + filtros rápidos */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Buscador */}
        <form
          action="/catalog"
          className="flex w-full max-w-md gap-2 text-sm"
        >
          <input
            type="text"
            name="q"
            defaultValue={searchParams?.q ?? ""}
            placeholder="Buscar por nombre (ej: cloro, desengrasante)..."
            className="flex-1 rounded-md border border-neutral-700 bg-transparent px-2 py-1 outline-none focus:border-neutral-400"
          />
          <button
            type="submit"
            className="rounded-md border px-3 py-1 font-medium hover:bg-white hover:text-black transition"
          >
            Buscar
          </button>
        </form>

        {/* Filtros rápidos por categoría (texto) */}
        <div className="flex flex-wrap gap-2 text-xs md:text-sm">
          <span className="text-neutral-400">Filtrar rápido:</span>
          <a
            href="/catalog"
            className={`rounded-full border px-3 py-1 ${
              !category ? "border-white" : "border-neutral-600"
            }`}
          >
            Todos
          </a>
          <a
            href="/catalog?cat=cloro"
            className={`rounded-full border px-3 py-1 ${
              category === "cloro" ? "border-white" : "border-neutral-600"
            }`}
          >
            Cloro y desinfectantes
          </a>
          <a
            href="/catalog?cat=hogar"
            className={`rounded-full border px-3 py-1 ${
              category === "hogar" ? "border-white" : "border-neutral-600"
            }`}
          >
            Limpieza del hogar
          </a>
          <a
            href="/catalog?cat=personal"
            className={`rounded-full border px-3 py-1 ${
              category === "personal" ? "border-white" : "border-neutral-600"
            }`}
          >
            Limpieza personal
          </a>
        </div>
      </div>

      {/* Info de resultados */}
      <p className="text-xs text-neutral-400">
        {totalCount === 0
          ? "No se encontraron productos para estos filtros."
          : `Mostrando ${totalCount} producto${
              totalCount === 1 ? "" : "s"
            } disponibles.`}
      </p>

      {/* Productos destacados */}
      {featuredProducts.length > 0 && (
        <OffersCarousel
          products={featuredProducts}
          title="Ofertas y productos destacados"
          subtitle="Selección de productos recomendados. Más adelante se podrán marcar directamente desde el panel admin."
        />
      )}


      {/* Todo el catálogo filtrado */}
      {filteredProducts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Todo el catálogo</h2>
          <ProductGrid products={filteredProducts} />
        </div>
      )}
    </section>
  );
}
