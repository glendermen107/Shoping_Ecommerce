// Tipo de categoría del backend
export type Category = {
  id: number;
  name: string;
  slug: string;
};

// Tipo de producto que devuelve el backend
export type Product = {
  id: number;  // Backend devuelve number
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  stock?: number;

  // Relación con categoría (puede ser null)
  category?: Category | null;

  // Campos para ofertas y destacados
  isFeatured?: boolean;
  isOnSale?: boolean;
  discountPercent?: number | null;
};

// Tipo de item del carrito (respuesta del backend)
export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;  // Total del item (price * quantity)
  imageUrl?: string;
};

// Respuesta completa del carrito desde el backend
export type CartResponse = {
  id?: number | null;  // ID del carrito (null para invitados)
  items: CartItem[];
  subtotal: number;
  taxes: number;
  total: number;
};
