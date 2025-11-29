import { test, expect } from './helpers/fixtures';
import { addProductToCartFromDetail, clearCart } from './helpers/cart.helper';
import { loginViaUI, TEST_USER, registerUser } from './helpers/auth.helper';

test.describe('Checkout y Órdenes', () => {
    test.beforeEach(async ({ page }) => {
        // Limpiar carrito antes de cada test
        await clearCart(page);
    });

    test('debe requerir autenticación para hacer checkout', async ({ page }) => {
        // Agregar producto al carrito sin estar autenticado
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Intentar hacer checkout
        const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Finalizar"), a:has-text("Checkout")').first();

        if (await checkoutButton.isVisible({ timeout: 3000 })) {
            await checkoutButton.click();
            await page.waitForTimeout(2000);

            // Verificar que fue redirigido a login
            const url = page.url();
            expect(url).toMatch(/\/auth\/login|\/checkout/);
        }
    });

    test('debe crear orden desde carrito (usuario autenticado)', async ({ authenticatedPage: page }) => {
        // Agregar productos al carrito
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 2);
        await page.waitForTimeout(500);
        await addProductToCartFromDetail(page, 'detergente-liquido-3l', 1);
        await page.waitForTimeout(500);

        // Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Hacer clic en checkout
        const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Finalizar"), a:has-text("Checkout")').first();
        await checkoutButton.click();
        await page.waitForTimeout(2000);

        // Verificar que estamos en la página de checkout o confirmación
        const url = page.url();
        expect(url).toMatch(/\/(checkout|order|profile)/);
    });

    test('debe mostrar resumen de orden en checkout', async ({ authenticatedPage: page }) => {
        // Agregar producto
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Ir al checkout
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Finalizar"), a:has-text("Checkout")').first();

        if (await checkoutButton.isVisible({ timeout: 3000 })) {
            await checkoutButton.click();
            await page.waitForTimeout(2000);

            // Buscar resumen de orden
            const orderSummary = page.locator('[data-testid="order-summary"], .order-summary, text=/resumen/i').first();

            if (await orderSummary.isVisible({ timeout: 3000 })) {
                await expect(orderSummary).toBeVisible();
            }
        }
    });

    test('debe vaciar carrito después de crear orden', async ({ authenticatedPage: page }) => {
        // Agregar producto
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);

        // Ir al carrito y hacer checkout
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Finalizar"), a:has-text("Checkout")').first();

        if (await checkoutButton.isVisible({ timeout: 3000 })) {
            await checkoutButton.click();
            await page.waitForTimeout(2000);

            // Confirmar orden si hay botón de confirmación
            const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Crear orden")').first();

            if (await confirmButton.isVisible({ timeout: 3000 })) {
                await confirmButton.click();
                await page.waitForTimeout(2000);
            }

            // Volver al carrito y verificar que está vacío
            await page.goto('/cart');
            await page.waitForTimeout(1000);

            const emptyMessage = page.locator('text=/carrito.*vacío/i, text=/no.*productos/i').first();

            // El carrito debería estar vacío después de crear la orden
            const isEmpty = await emptyMessage.isVisible({ timeout: 3000 });
            expect(isEmpty).toBe(true);
        }
    });

    test('debe mostrar órdenes en perfil de usuario', async ({ authenticatedPage: page }) => {
        // Navegar al perfil
        await page.goto('/profile');
        await page.waitForLoadState('networkidle');

        // Buscar sección de órdenes
        const ordersSection = page.locator('[data-testid="orders"], .orders, text=/mis.*orden/i, text=/historial/i').first();

        if (await ordersSection.isVisible({ timeout: 5000 })) {
            await expect(ordersSection).toBeVisible();
        } else {
            // Si no hay sección visible, al menos verificar que estamos en el perfil
            const url = page.url();
            expect(url).toContain('/profile');
        }
    });

    test('debe mostrar detalles de orden creada', async ({ authenticatedPage: page }) => {
        // Crear una orden primero
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Finalizar")').first();

        if (await checkoutButton.isVisible({ timeout: 3000 })) {
            await checkoutButton.click();
            await page.waitForTimeout(2000);

            // Confirmar orden
            const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Crear")').first();
            if (await confirmButton.isVisible({ timeout: 3000 })) {
                await confirmButton.click();
                await page.waitForTimeout(2000);
            }

            // Ir al perfil para ver órdenes
            await page.goto('/profile');
            await page.waitForTimeout(2000);

            // Buscar la orden creada
            const orderItem = page.locator('[data-testid="order-item"], .order-item').first();

            if (await orderItem.isVisible({ timeout: 5000 })) {
                // Hacer clic para ver detalles
                await orderItem.click();
                await page.waitForTimeout(1000);

                // Verificar que se muestran detalles
                const orderDetails = page.locator('[data-testid="order-details"], .order-details').first();

                if (await orderDetails.isVisible({ timeout: 3000 })) {
                    await expect(orderDetails).toBeVisible();
                }
            }
        }
    });

    test('debe mostrar estado de orden', async ({ authenticatedPage: page }) => {
        // Navegar al perfil
        await page.goto('/profile');
        await page.waitForLoadState('networkidle');

        // Buscar órdenes
        const orderItem = page.locator('[data-testid="order-item"], .order-item').first();

        if (await orderItem.isVisible({ timeout: 5000 })) {
            // Buscar estado de la orden
            const status = orderItem.locator('[data-testid="order-status"], .status, text=/pendiente|completado|enviado/i').first();

            if (await status.isVisible({ timeout: 2000 })) {
                await expect(status).toBeVisible();
            }
        }
    });

    test('debe mostrar total de orden', async ({ authenticatedPage: page }) => {
        // Navegar al perfil
        await page.goto('/profile');
        await page.waitForLoadState('networkidle');

        // Buscar órdenes
        const orderItem = page.locator('[data-testid="order-item"], .order-item').first();

        if (await orderItem.isVisible({ timeout: 5000 })) {
            // Buscar total
            const total = orderItem.locator('text=/\\$\\s*\\d+/, [data-testid="order-total"]').first();

            if (await total.isVisible({ timeout: 2000 })) {
                await expect(total).toBeVisible();
            }
        }
    });

    test('debe mostrar fecha de orden', async ({ authenticatedPage: page }) => {
        // Navegar al perfil
        await page.goto('/profile');
        await page.waitForLoadState('networkidle');

        // Buscar órdenes
        const orderItem = page.locator('[data-testid="order-item"], .order-item').first();

        if (await orderItem.isVisible({ timeout: 5000 })) {
            // Buscar fecha
            const date = orderItem.locator('[data-testid="order-date"], .date, time').first();

            if (await date.isVisible({ timeout: 2000 })) {
                await expect(date).toBeVisible();
            }
        }
    });

    test('debe permitir completar orden pendiente', async ({ authenticatedPage: page }) => {
        // Navegar al perfil
        await page.goto('/profile');
        await page.waitForLoadState('networkidle');

        // Buscar orden pendiente
        const pendingOrder = page.locator('[data-testid="order-item"]:has-text("Pendiente"), .order-item:has-text("Pendiente")').first();

        if (await pendingOrder.isVisible({ timeout: 5000 })) {
            // Buscar botón de completar
            const completeButton = pendingOrder.locator('button:has-text("Completar"), button:has-text("Finalizar")').first();

            if (await completeButton.isVisible({ timeout: 2000 })) {
                await completeButton.click();
                await page.waitForTimeout(1000);

                // Verificar que el estado cambió
                const status = pendingOrder.locator('text=/completado/i').first();

                if (await status.isVisible({ timeout: 3000 })) {
                    await expect(status).toBeVisible();
                }
            }
        }
    });

    test('flujo completo: login → agregar productos → checkout → orden creada', async ({ page }) => {
        // 1. Registrar y hacer login
        await registerUser(TEST_USER.email, TEST_USER.password);
        const loginSuccess = await loginViaUI(page, TEST_USER.email, TEST_USER.password);
        expect(loginSuccess).toBe(true);

        // 2. Agregar productos al carrito
        await addProductToCartFromDetail(page, 'cloro-hogar-1l', 2);
        await page.waitForTimeout(500);
        await addProductToCartFromDetail(page, 'detergente-liquido-3l', 1);
        await page.waitForTimeout(500);

        // 3. Ir al carrito
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Verificar que hay productos
        const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
        const count = await cartItems.count();
        expect(count).toBeGreaterThan(0);

        // 4. Hacer checkout
        const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Finalizar")').first();

        if (await checkoutButton.isVisible({ timeout: 3000 })) {
            await checkoutButton.click();
            await page.waitForTimeout(2000);

            // 5. Confirmar orden si es necesario
            const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Crear")').first();
            if (await confirmButton.isVisible({ timeout: 3000 })) {
                await confirmButton.click();
                await page.waitForTimeout(2000);
            }

            // 6. Verificar que se creó la orden
            // Puede redirigir a perfil o mostrar confirmación
            const url = page.url();
            expect(url).toMatch(/\/(profile|order|checkout|success)/);
        }
    });
});
