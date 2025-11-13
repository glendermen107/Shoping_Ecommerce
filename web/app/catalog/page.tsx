import ProductGrid from "../../components/productGrid";
import { fetchProducts } from "../../lib/api";

export default async function CatalogPage() {
  const products = await fetchProducts();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Catálogo</h1>
      <ProductGrid products={products} />
    </section>
  );
}
