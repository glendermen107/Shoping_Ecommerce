import type { Product } from "./types";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function fetchProducts(query?: string): Promise<Product[]> {
  try {
    const url = new URL(`${apiBaseUrl}/products`);

    if (query) {
      url.searchParams.set("q", query);
    }

    const response = await fetch(url.toString(), { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`);
    }

    const data = (await response.json()) as Product[];
    return data;
  } catch (error) {
    console.error("fetchProducts error:", error);

    // Fallback de desarrollo por si el backend se cae
    return [
      {
        id: "1",
        slug: "zapatillas",
        name: "Zapatillas",
        price: 39990,
        imageUrl: "/placeholder.png",
        description: "Producto de ejemplo",
      },
      {
        id: "2",
        slug: "polera",
        name: "Polera",
        price: 12990,
        imageUrl: "/placeholder.png",
        description: "Producto de ejemplo",
      },
    ];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  // Por ahora buscamos por slug en la lista completa
  const products = await fetchProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
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
