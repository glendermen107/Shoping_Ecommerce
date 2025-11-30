export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  // Opcionales, por si el backend los expone:
  stock?: number;
  categoryName?: string;

  categoryKey?: "cloro" | "hogar" | "personal";


  isFeatured?: boolean;        // para el carrusel
  isOnSale?: boolean;          // para marcar que está en oferta
  discountPercent?: number;    // % de descuento (ej: 10, 15, 20)
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // precio unitario en CLP
}

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  total: number;
  status: OrderStatus;
  createdAt: string; // ISO string

  items: OrderItem[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;

  // datos agregados para mostrar en el admin
  ordersCount?: number;
  totalSpent?: number;
}