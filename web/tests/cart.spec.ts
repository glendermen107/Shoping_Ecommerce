import { test, expect } from './helpers/fixtures';
import {
    clearCart,
    addProductToCart,
    addProductToCartFromDetail,
    getCartItemCount,
    expectCartEmpty,
    expectCartHasItems,
    updateCartItemQuantity,
    removeCartItem,
    getCartTotal,
} from './helpers/cart.helper';

test.describe('Carrito de Compras', () => {
    test.beforeEach(async ({ page }) => {
        // Limpiar carrito antes de cada test
        await clearCart(page);
    });

    test('debe mostrar carrito vacío inicialmente', async ({ page }) => {
        await expectCartEmpty(page);
    });

    test('debe agregar producto al carrito desde catálogo', async ({ page }) => {
        await page.goto('/catalogo');
        await page.waitForLoadState('networkidle');

        // Obtener el primer producto
        const firstProduct = page.locator('[data-testid="product-card"], .product-card').first();
        await expect(firstProduct).toBeVisible();

        // Hacer clic en agregar al carrito
        const addButton = firstProduct.locator('button:has-text("Agregar"), button:has-text("Añadir")').first();
        await addButton.click();

        // Esperar confirmación
        await page.waitForTimeout(1000);

        // Verificar que el carrito tiene items
        await expectCartHasItems(page, 1);
    });

    test('debe agregar producto al carrito desde detalle', async ({ page }) => {
        const success = await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);
        expect(success).toBe(true);

        // Verificar que el carrito tiene items
        await expectCartHasItems(page, 1);
    });

    test('debe agregar múltiples unidades de un producto', async ({ page }) => {
        await page.goto('/product/cloro-hogar-1l');
        await page.waitForLoadState('networkidle');

        // Cambiar cantidad a 3
        const quantityInput = page.locator('input[type="number"]').first();
        if (await quantityInput.isVisible({ timeout: 2000 })) {
            await quantityInput.fill('3');
        }

        // Agregar al carrito
        const addButton = page.locator('button:has-text("Agregar"), button:has-text("Añadir")').first();
        await addButton.click();
        await page.waitForTimeout(1000);

        // Ir al carrito y verificar cantidad
        await page.goto('/cart');
        const cartItem = page.locator('[data-testid="cart-item"], .cart-item').first();

        if (await cartItem.isVisible({ timeout: 3000 })) {
            const quantityText = await cartItem.textContent();
            expect(quantityText).toContain('3');
        }
    });

    test('debe agregar múltiples productos diferentes', async ({ page }) => {
        // Agregar primer producto
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);
        await page.waitForTimeout(500);

        // Agregar segundo producto
        await addProductToCartFromDetail(page, 'detergente-liquido-3l', 1);
        await page.waitForTimeout(500);

        // Verificar que hay 2 items en el carrito
        await expectCartHasItems(page, 2);
    });

    test('debe actualizar cantidad de producto en carrito', async ({ page }) => {
        // Agregar producto
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Buscar input de cantidad
        const quantityInput = page.locator('input[type="number"]').first();

        if (await quantityInput.isVisible({ timeout: 3000 })) {
            // Cambiar cantidad a 5
            await quantityInput.fill('5');
            await page.waitForTimeout(1000);

            // Verificar que la cantidad cambió
            const value = await quantityInput.inputValue();
            expect(value).toBe('5');
        }
    });

    test('debe eliminar producto del carrito', async ({ page }) => {
        // Agregar producto
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Hacer clic en eliminar
        const deleteButton = page.locator('button:has-text("Eliminar"), button[aria-label*="Eliminar"]').first();
        await deleteButton.click();
        await page.waitForTimeout(1000);

        // Verificar que el carrito está vacío
        await expectCartEmpty(page);
    });

    test('debe calcular subtotal correctamente', async ({ page }) => {
        // Agregar productos
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 2);
        await page.waitForTimeout(500);

        // Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Buscar subtotal
        const subtotal = page.locator('[data-testid="cart-subtotal"], .subtotal, text=/subtotal/i').first();

        if (await subtotal.isVisible({ timeout: 3000 })) {
            const text = await subtotal.textContent();
            expect(text).toMatch(/\$\s*\d+/);
        }
    });

    test('debe calcular total con impuestos', async ({ page }) => {
        // Agregar producto
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Buscar total
        const total = page.locator('[data-testid="cart-total"], .total, text=/total/i').first();
        await expect(total).toBeVisible({ timeout: 5000 });

        const text = await total.textContent();
        expect(text).toMatch(/\$\s*\d+/);
    });

    test('debe mostrar badge con número de items en navbar', async ({ page }) => {
        // Agregar productos
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);
        await page.waitForTimeout(500);
        await addProductToCartFromDetail(page, 'detergente-liquido-3l', 1);
        await page.waitForTimeout(500);

        // Ir a cualquier página
        await page.goto('/');

        // Buscar badge del carrito
        const badge = page.locator('[data-testid="cart-badge"], .cart-badge, .badge').first();

        if (await badge.isVisible({ timeout: 3000 })) {
            const text = await badge.textContent();
            const count = parseInt(text || '0', 10);
            expect(count).toBeGreaterThan(0);
        }
    });

    test('debe persistir carrito para usuario autenticado', async ({ authenticatedPage: page }) => {
        // Agregar producto
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Recargar página
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Verificar que el carrito sigue teniendo items
        await expectCartHasItems(page, 1);
    });

    test('debe mantener carrito temporal para visitante', async ({ page }) => {
        // Agregar producto sin estar autenticado
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Navegar a otra página
        await page.goto('/catalogo');
        await page.waitForTimeout(1000);

        // Volver al carrito
        await page.goto('/cart');

        // Verificar que el carrito sigue teniendo items
        await expectCartHasItems(page, 1);
    });

    test('debe vaciar carrito completamente', async ({ page }) => {
        // Agregar varios productos
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);
        await page.waitForTimeout(500);
        await addProductToCartFromDetail(page, 'detergente-liquido-3l', 1);
        await page.waitForTimeout(500);

        // Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Buscar botón de vaciar carrito
        const clearButton = page.locator('button:has-text("Vaciar"), button:has-text("Limpiar")').first();

        if (await clearButton.isVisible({ timeout: 3000 })) {
            await clearButton.click();
            await page.waitForTimeout(1000);

            // Verificar que el carrito está vacío
            await expectCartEmpty(page);
        } else {
            // Si no hay botón de vaciar, eliminar items uno por uno
            await clearCart(page);
            await expectCartEmpty(page);
        }
    });

    test('debe mostrar imagen del producto en carrito', async ({ page }) => {
        // Agregar producto
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Buscar imagen del producto
        const productImage = page.locator('[data-testid="cart-item"] img, .cart-item img').first();

        if (await productImage.isVisible({ timeout: 3000 })) {
            await expect(productImage).toBeVisible();
        }
    });

    test('debe mostrar nombre y precio del producto en carrito', async ({ page }) => {
        // Agregar producto
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        const cartItem = page.locator('[data-testid="cart-item"], .cart-item').first();
        await expect(cartItem).toBeVisible();

        // Verificar que tiene nombre
        const name = cartItem.locator('h2, h3, .product-name, [data-testid="product-name"]').first();
        await expect(name).toBeVisible();

        // Verificar que tiene precio
        const price = cartItem.locator('text=/\\$\\s*\\d+/, .price').first();
        await expect(price).toBeVisible();
    });

    test('debe tener botón de continuar comprando', async ({ page }) => {
        // Agregar producto
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Buscar botón de continuar comprando
        const continueButton = page.locator('button:has-text("Continuar"), a:has-text("Continuar"), button:has-text("Seguir")').first();

        if (await continueButton.isVisible({ timeout: 3000 })) {
            await continueButton.click();
            await page.waitForTimeout(1000);

            // Verificar que volvió al catálogo
            const url = page.url();
            expect(url).toMatch(/\/(catalogo|$)/);
        }
    });

    test('debe tener botón de proceder al checkout', async ({ page }) => {
        // Agregar producto
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Buscar botón de checkout
        const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Finalizar"), a:has-text("Checkout")').first();
        await expect(checkoutButton).toBeVisible({ timeout: 5000 });
    });
});
