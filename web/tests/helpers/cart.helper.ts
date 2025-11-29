import { Page, expect } from '@playwright/test';

/**
 * Limpia el carrito completamente
 */
export async function clearCart(page: Page): Promise<void> {
    try {
        // Navegar al carrito
        await page.goto('/cart');

        // Esperar a que cargue
        await page.waitForTimeout(1000);

        // Buscar y hacer clic en todos los botones de eliminar
        const deleteButtons = page.locator('button:has-text("Eliminar"), button[aria-label*="Eliminar"], button[title*="Eliminar"]');
        const count = await deleteButtons.count();

        for (let i = 0; i < count; i++) {
            // Siempre hacer clic en el primer botón (porque se eliminan dinámicamente)
            const button = deleteButtons.first();
            if (await button.isVisible({ timeout: 1000 })) {
                await button.click();
                await page.waitForTimeout(500);
            }
        }

        // También limpiar localStorage del carrito
        await page.evaluate(() => {
            localStorage.removeItem('cart');
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
}

/**
 * Agrega un producto al carrito desde la página de catálogo
 */
export async function addProductToCart(page: Page, productName: string): Promise<boolean> {
    try {
        await page.goto('/catalogo');

        // Buscar el producto por nombre
        const productCard = page.locator(`[data-testid="product-card"]:has-text("${productName}")`).first();

        if (!await productCard.isVisible({ timeout: 5000 })) {
            // Intentar con selector alternativo
            const altCard = page.locator(`.product-card:has-text("${productName}")`).first();
            if (await altCard.isVisible({ timeout: 2000 })) {
                await altCard.locator('button:has-text("Agregar")').click();
                await page.waitForTimeout(1000);
                return true;
            }
            return false;
        }

        // Hacer clic en el botón de agregar
        await productCard.locator('button:has-text("Agregar"), button:has-text("Añadir")').first().click();

        // Esperar confirmación
        await page.waitForTimeout(1000);

        return true;
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return false;
    }
}

/**
 * Agrega un producto al carrito desde la página de detalle
 */
export async function addProductToCartFromDetail(page: Page, productSlug: string, quantity = 1): Promise<boolean> {
    try {
        await page.goto(`/product/${productSlug}`);

        // Esperar a que cargue la página
        await page.waitForLoadState('networkidle');

        // Ajustar cantidad si es necesario
        if (quantity > 1) {
            const quantityInput = page.locator('input[type="number"]').first();
            if (await quantityInput.isVisible({ timeout: 2000 })) {
                await quantityInput.fill(quantity.toString());
            }
        }

        // Hacer clic en agregar al carrito
        const addButton = page.locator('button:has-text("Agregar al carrito"), button:has-text("Añadir al carrito")').first();
        await addButton.click();

        // Esperar confirmación
        await page.waitForTimeout(1000);

        return true;
    } catch (error) {
        console.error('Error adding product from detail:', error);
        return false;
    }
}

/**
 * Obtiene el número de items en el carrito desde el badge del navbar
 */
export async function getCartItemCount(page: Page): Promise<number> {
    try {
        const badge = page.locator('[data-testid="cart-badge"], .cart-badge, .badge').first();

        if (!await badge.isVisible({ timeout: 2000 })) {
            return 0;
        }

        const text = await badge.textContent();
        return parseInt(text || '0', 10);
    } catch {
        return 0;
    }
}

/**
 * Verifica que el carrito esté vacío
 */
export async function expectCartEmpty(page: Page): Promise<void> {
    await page.goto('/cart');

    // Buscar mensaje de carrito vacío
    const emptyMessage = page.locator('text=/carrito.*vacío/i, text=/no.*productos/i').first();
    await expect(emptyMessage).toBeVisible({ timeout: 5000 });
}

/**
 * Verifica que el carrito tenga items
 */
export async function expectCartHasItems(page: Page, minItems = 1): Promise<void> {
    await page.goto('/cart');

    // Buscar items en el carrito
    const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
    await expect(cartItems.first()).toBeVisible({ timeout: 5000 });

    const count = await cartItems.count();
    expect(count).toBeGreaterThanOrEqual(minItems);
}

/**
 * Actualiza la cantidad de un producto en el carrito
 */
export async function updateCartItemQuantity(page: Page, productName: string, newQuantity: number): Promise<boolean> {
    try {
        await page.goto('/cart');

        // Buscar el item del producto
        const cartItem = page.locator(`[data-testid="cart-item"]:has-text("${productName}")`).first();

        if (!await cartItem.isVisible({ timeout: 3000 })) {
            return false;
        }

        // Buscar el input de cantidad
        const quantityInput = cartItem.locator('input[type="number"]').first();
        await quantityInput.fill(newQuantity.toString());

        // Esperar a que se actualice
        await page.waitForTimeout(1000);

        return true;
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return false;
    }
}

/**
 * Elimina un producto específico del carrito
 */
export async function removeCartItem(page: Page, productName: string): Promise<boolean> {
    try {
        await page.goto('/cart');

        // Buscar el item del producto
        const cartItem = page.locator(`[data-testid="cart-item"]:has-text("${productName}")`).first();

        if (!await cartItem.isVisible({ timeout: 3000 })) {
            return false;
        }

        // Hacer clic en el botón de eliminar
        const deleteButton = cartItem.locator('button:has-text("Eliminar"), button[aria-label*="Eliminar"]').first();
        await deleteButton.click();

        // Esperar a que se elimine
        await page.waitForTimeout(1000);

        return true;
    } catch (error) {
        console.error('Error removing cart item:', error);
        return false;
    }
}

/**
 * Obtiene el total del carrito
 */
export async function getCartTotal(page: Page): Promise<number> {
    try {
        await page.goto('/cart');

        // Buscar el elemento del total
        const totalElement = page.locator('[data-testid="cart-total"], .cart-total, text=/total.*\\$/i').first();

        if (!await totalElement.isVisible({ timeout: 3000 })) {
            return 0;
        }

        const text = await totalElement.textContent();
        const match = text?.match(/\$?\s*(\d+(?:[.,]\d+)?)/);

        if (match) {
            return parseFloat(match[1].replace(',', ''));
        }

        return 0;
    } catch {
        return 0;
    }
}
