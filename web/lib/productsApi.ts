/**
 * API de Productos - Integración completa con backend
 */

import { api } from './apiClient';
import type { Product } from './types';

export type CreateProductDto = {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string; // Backend expects single URL string (optional)
    categoryId: number;
    isFeatured?: boolean;
    isOnSale?: boolean;
    discountPercent?: number | null;
};

export type UpdateProductDto = {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
    categoryId?: number;
    isFeatured?: boolean;
    isOnSale?: boolean;
    discountPercent?: number | null;
};

export type GetProductsParams = {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
};

/**
 * Obtener lista de productos con paginación y filtros
 * GET /products
 */
export async function getProducts(params?: GetProductsParams): Promise<Product[]> {
    try {
        // Por ahora el backend no soporta paginación en el endpoint,
        // así que obtenemos todos y filtramos en el cliente
        const response = await api.get<Product[]>('/products');

        let filtered = response;

        // Filtrar por búsqueda
        if (params?.search) {
            const searchLower = params.search.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchLower) ||
                    p.slug.toLowerCase().includes(searchLower) ||
                    (p.category?.name || '').toLowerCase().includes(searchLower)
            );
        }

        // Filtrar por categoría
        if (params?.category && params.category !== 'all') {
            filtered = filtered.filter((p) => p.category?.slug === params.category);
        }

        return filtered;
    } catch (error: any) {
        console.error('Error fetching products:', error);
        throw new Error(error.message || 'Error al obtener productos');
    }
}

/**
 * Obtener un producto por ID
 * GET /products/:id
 */
export async function getProduct(id: number): Promise<Product> {
    try {
        const response = await api.get<Product>(`/products/${id}`);
        return response;
    } catch (error: any) {
        console.error(`Error fetching product ${id}:`, error);
        throw new Error(error.message || 'Error al obtener producto');
    }
}

/**
 * Crear un nuevo producto (solo admin)
 * POST /products
 */
export async function createProduct(data: CreateProductDto): Promise<Product> {
    try {
        const response = await api.post<Product>('/products', data);
        return response;
    } catch (error: any) {
        console.error('Error creating product:', error);
        throw new Error(error.message || 'Error al crear producto');
    }
}

/**
 * Actualizar un producto (solo admin)
 * PUT /products/:id
 */
export async function updateProduct(
    id: number,
    data: UpdateProductDto
): Promise<Product> {
    try {
        const response = await api.put<Product>(`/products/${id}`, data);
        return response;
    } catch (error: any) {
        console.error(`Error updating product ${id}:`, error);
        throw new Error(error.message || 'Error al actualizar producto');
    }
}

/**
 * Eliminar un producto (solo admin)
 * DELETE /products/:id
 */
export async function deleteProduct(id: number): Promise<void> {
    try {
        await api.delete(`/products/${id}`);
    } catch (error: any) {
        console.error(`Error deleting product ${id}:`, error);
        throw new Error(error.message || 'Error al eliminar producto');
    }
}
