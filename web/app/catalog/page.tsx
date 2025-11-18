import ProductGrid from "../../components/productGrid";
import OffersCarousel from "../../components/offersCarousel";
import { fetchProducts } from "../../lib/api";

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

  // Filtro por texto y "categoría" simple basada en nombre
  const filteredProducts = products.filter((product) => {
    const name = product.name.toLowerCase();
    const matchesSearch = search ? name.includes(search) : true;
    const matchesCategory = category ? name.includes(category) : true;
    return matchesSearch && matchesCategory;
  });

  const totalCount = filteredProducts.length;

  // Destacados para el carrusel:
  // 1) Primero los que vienen marcados con isFeatured
  // 2) Si no hay, tomamos los primeros 4 como fallback
  let featuredProducts = filteredProducts.filter((p) => p.isFeatured);

  if (featuredProducts.length === 0) {
    featuredProducts = filteredProducts.slice(0, 4);
  }

  return (
    <section className="space-y-8">
      {/* Encabezado + promo de despacho */}
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-emerald-800">Catálogo</h1>
        <p className="text-slate-700 text-sm">
          Explora nuestros productos de limpieza para hogar y empresas. 
          Despacho a distintas comunas y opción de retiro en tienda.
        </p>

        <div className="rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm">
          <p className="font-medium text-emerald-800">
            🛻 Despacho gratis sobre $50.000 en productos.
          </p>
          <p className="text-slate-500 text-xs">
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
            className="flex-1 rounded-md border border-emerald-200 bg-white/70 px-2 py-1 outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-3 py-1 font-medium text-white hover:bg-emerald-700 transition"
          >
            Buscar
          </button>
        </form>

        {/* Filtros rápidos por categoría (por nombre) */}
        <div className="flex flex-wrap gap-2 text-xs md:text-sm">
          <span className="text-slate-500">Filtrar rápido:</span>
          <a
            href="/catalog"
            className={`rounded-full border px-3 py-1 ${
              !category
                ? "border-emerald-500 text-emerald-700 bg-white/80"
                : "border-emerald-200 text-slate-600 hover:bg-emerald-50"
            }`}
          >
            Todos
          </a>
          <a
            href="/catalog?cat=cloro"
            className={`rounded-full border px-3 py-1 ${
              category === "cloro"
                ? "border-emerald-500 text-emerald-700 bg-white/80"
                : "border-emerald-200 text-slate-600 hover:bg-emerald-50"
            }`}
          >
            Cloro y desinfectantes
          </a>
          <a
            href="/catalog?cat=hogar"
            className={`rounded-full border px-3 py-1 ${
              category === "hogar"
                ? "border-emerald-500 text-emerald-700 bg.white/80"
                : "border-emerald-200 text-slate-600 hover:bg-emerald-50"
            }`}
          >
            Limpieza del hogar
          </a>
          <a
            href="/catalog?cat=personal"
            className={`rounded-full border px-3 py-1 ${
              category === "personal"
                ? "border-emerald-500 text-emerald-700 bg.white/80"
                : "border-emerald-200 text-slate-600 hover:bg-emerald-50"
            }`}
          >
            Limpieza personal
          </a>
        </div>
      </div>

      {/* Info de resultados */}
      <p className="text-xs text-slate-500">
        {totalCount === 0
          ? "No se encontraron productos para estos filtros."
          : `Mostrando ${totalCount} producto${
              totalCount === 1 ? "" : "s"
            } disponibles.`}
      </p>

      {/* Carrusel de ofertas / destacados */}
      {featuredProducts.length > 0 && (
        <OffersCarousel
          products={featuredProducts}
          title="Ofertas y productos destacados"
          subtitle="Productos seleccionados manualmente (isFeatured) o a modo de ejemplo. Más adelante podrás gestionarlos desde el panel admin."
        />
      )}

      {/* Todo el catálogo filtrado */}
      {filteredProducts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-emerald-800">
            Todo el catálogo
          </h2>
          <ProductGrid products={filteredProducts} />
        </div>
      )}
    </section>
  );
}
