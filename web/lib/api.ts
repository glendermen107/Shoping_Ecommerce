import type { Product } from "./types";

export async function fetchProducts(query?: string): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:3001/products", {
      cache: "no-store",
    });

    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    // Datos mock por ahora
    return [
      {
        id: "1",
        slug: "zapatillas",
        name: "Zapatillas",
        price: 39990,
        imageUrl: "/placeholder.png",
        description: "Zapatillas de ejemplo",
      },
      {
        id: "2",
        slug: "polera",
        name: "Polera",
        price: 12990,
        imageUrl: "/placeholder.png",
        description: "Polera de ejemplo",
      },
    ];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const products = await fetchProducts();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    // Fallback por si no encuentra nada
    return {
      id: "0",
      slug,
      name: "Producto no encontrado",
      price: 0,
      description: "No existe este producto en el catálogo.",
    };
  }

  return product;
}
