export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};