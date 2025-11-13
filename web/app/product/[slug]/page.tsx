// web/app/product/[slug]/page.tsx
import { fetchProductBySlug } from "../../../lib/api";
import AddToCartButton from "../../../components/addToCartButton";

type ProductPageProps = {
  params: { slug: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProductBySlug(params.slug);

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.imageUrl || "/placeholder.png"}
        alt={product.name}
        className="w-full rounded-xl object-cover"
      />

      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-xl font-medium">
          ${product.price.toLocaleString()}
        </p>
        <p className="text-neutral-300">
          {product.description || "Producto sin descripción."}
        </p>

        <AddToCartButton product={product} />
      </div>
    </section>
  );
}
