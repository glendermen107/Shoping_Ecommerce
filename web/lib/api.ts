import type { Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Variable en memoria para almacenar el access token
let accessToken: string | null = null;

// Función para obtener el access token actual
export function getAccessToken(): string | null {
  return accessToken;
}

// Función para establecer el access token
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

// Función para refrescar el access token
async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // Importante: envía las cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      setAccessToken(null);
      return false;
    }

    const data = await response.json();
    setAccessToken(data.access_token);
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    setAccessToken(null);
    return false;
  }
}

// Cliente API mejorado con interceptor para renovación automática
export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_URL}${endpoint}`;

  // Agregar el access token si existe
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Primera petición
  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Importante: envía las cookies
  });

  // Si recibimos 401, intentar refrescar el token
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();

    if (refreshed && accessToken) {
      // Reintentar la petición original con el nuevo token
      headers["Authorization"] = `Bearer ${accessToken}`;
      response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    }
  }

  return response;
}

export async function fetchProducts(query?: string): Promise<Product[]> {
  try {
    const res = await apiClient("/products", {
      cache: "no-store",
    });

    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    // --- CATÁLOGO MOCK DEFINITIVO ---
    const mockProducts: Product[] = [
      // CLORO
      {
        id: "1",
        slug: "cloro-hogar-1l",
        name: "Cloro hogar 1L",
        price: 2490,
        description: "Cloro para uso domiciliario, ideal para baños y cocina.",
        imageUrl: "/placeholder.png",
        categoryKey: "cloro",
        categoryName: "Cloro y desinfectantes",
        stock: 120,
        isFeatured: true,
        isOnSale: true,
        discountPercent: 10,
      },
      {
        id: "2",
        slug: "cloro-industrial-5l",
        name: "Cloro industrial 5L",
        price: 6990,
        description: "Cloro concentrado para uso industrial y grandes superficies.",
        imageUrl: "/placeholder.png",
        categoryKey: "cloro",
        categoryName: "Cloro y desinfectantes",
        stock: 60,
        isFeatured: true,
        isOnSale: true,
        discountPercent: 15,
      },
      {
        id: "3",
        slug: "desinfectante-multiuso-1l",
        name: "Desinfectante multiuso 1L",
        price: 3990,
        description: "Desinfectante aromatizado para pisos, baños y superficies.",
        imageUrl: "/placeholder.png",
        categoryKey: "cloro",
        categoryName: "Cloro y desinfectantes",
        stock: 80,
      },

      // HOGAR
      {
        id: "4",
        slug: "detergente-liquido-3l",
        name: "Detergente líquido 3L",
        price: 5490,
        description: "Detergente para ropa, fórmula suave de alta limpieza.",
        imageUrl: "/placeholder.png",
        categoryKey: "hogar",
        categoryName: "Limpieza del hogar",
        stock: 90,
        isFeatured: true,
      },
      {
        id: "5",
        slug: "limpiador-pisos-2l",
        name: "Limpiador de pisos 2L",
        price: 3590,
        description: "Limpieza y brillo para pisos cerámicos y flotantes.",
        imageUrl: "/placeholder.png",
        categoryKey: "hogar",
        categoryName: "Limpieza del hogar",
        stock: 75,
      },
      {
        id: "6",
        slug: "desengrasante-cocina-1l",
        name: "Desengrasante de cocina 1L",
        price: 3990,
        description: "Desengrasante potente para cocina, campanas y hornos.",
        imageUrl: "/placeholder.png",
        categoryKey: "hogar",
        categoryName: "Limpieza del hogar",
        stock: 50,
        isOnSale: true,
        discountPercent: 12,
      },

      // PERSONAL
      {
        id: "7",
        slug: "jabón-liquido-manos-1l",
        name: "Jabón líquido de manos 1L",
        price: 2990,
        description: "Jabón líquido para manos, suave con la piel.",
        imageUrl: "/placeholder.png",
        categoryKey: "personal",
        categoryName: "Limpieza personal",
        stock: 100,
      },
      {
        id: "8",
        slug: "alcohol-gel-500ml",
        name: "Alcohol gel 500 ml",
        price: 2990,
        description: "Alcohol gel para uso personal, ideal para oficinas y locales.",
        imageUrl: "/placeholder.png",
        categoryKey: "personal",
        categoryName: "Limpieza personal",
        stock: 200,
        isFeatured: true,
      },
      {
        id: "9",
        slug: "toallas-desinfectantes-80u",
        name: "Toallas desinfectantes (80 unidades)",
        price: 4490,
        description: "Toallas desinfectantes para manos y superficies.",
        imageUrl: "/placeholder.png",
        categoryKey: "personal",
        categoryName: "Limpieza personal",
        stock: 65,
        isOnSale: true,
        discountPercent: 8,
      },
    ];

    return mockProducts;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const products = await fetchProducts();
  const product = products.find((p) => p.slug === slug);

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

// Funciones de autenticación
export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Importante: permite recibir cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error de autenticación" }));
    throw new Error(error.message || "Credenciales inválidas");
  }

  const data = await response.json();
  setAccessToken(data.access_token);
  return data;
}

export async function registerUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error en el registro" }));
    throw new Error(error.message || "No se pudo registrar el usuario");
  }

  return await response.json();
}

export async function logoutUser() {
  try {
    await apiClient("/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    setAccessToken(null);
  }
}

// Función para verificar si el usuario está autenticado
export async function checkAuth() {
  try {
    const refreshed = await refreshAccessToken();
    return refreshed;
  } catch {
    return false;
  }
}
