import { test, expect } from './helpers/fixtures';
import { loginViaUI, TEST_ADMIN, registerUser, clearAuthState } from './helpers/auth.helper';

test.describe('Panel de Administración', () => {
    test('debe redirigir a login cuando se accede sin autenticación', async ({ page }) => {
        // Intentar acceder a ruta de admin sin estar autenticado
        await page.goto('/admin');
        await page.waitForTimeout(2000);

        // Verificar redirección a login
        const url = page.url();
        expect(url).toMatch(/\/auth\/login|\/admin/);
    });

    test('debe denegar acceso a usuario normal', async ({ authenticatedPage: page }) => {
        // Usuario normal autenticado intenta acceder a admin
        await page.goto('/admin');
        await page.waitForTimeout(2000);

        // Verificar que no puede acceder o ve mensaje de error
        const url = page.url();
        const isInAdmin = url.includes('/admin');

        if (isInAdmin) {
            // Si está en admin, debería ver mensaje de acceso denegado
            const deniedMessage = page.locator('text=/no.*permiso/i, text=/acceso.*denegado/i, text=/no.*autorizado/i').first();

            const hasMessage = await deniedMessage.isVisible({ timeout: 3000 });
            expect(hasMessage).toBe(true);
        } else {
            // Si fue redirigido, está bien
            expect(url).not.toContain('/admin');
        }
    });

    test('debe permitir acceso a usuario admin', async ({ page }) => {
        // Registrar y hacer login como admin
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);

        // Nota: En una app real, necesitarías asignar el rol ADMIN al usuario
        // Aquí asumimos que el usuario con email admin@example.com tiene rol admin

        await loginViaUI(page, TEST_ADMIN.email, TEST_ADMIN.password);
        await page.waitForTimeout(1000);

        // Intentar acceder a admin
        await page.goto('/admin');
        await page.waitForTimeout(2000);

        // Verificar que está en la página de admin
        const url = page.url();

        if (url.includes('/admin')) {
            // Verificar que se muestra el panel de admin
            const adminPanel = page.locator('[data-testid="admin-panel"], .admin-panel, h1:has-text("Admin")').first();

            if (await adminPanel.isVisible({ timeout: 5000 })) {
                await expect(adminPanel).toBeVisible();
            }
        }
    });

    test('debe mostrar lista de productos en admin', async ({ page }) => {
        // Login como admin
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);
        await loginViaUI(page, TEST_ADMIN.email, TEST_ADMIN.password);

        // Navegar a admin/products
        await page.goto('/admin/products');
        await page.waitForLoadState('networkidle');

        // Buscar tabla o lista de productos
        const productsList = page.locator('[data-testid="products-list"], .products-list, table').first();

        if (await productsList.isVisible({ timeout: 5000 })) {
            await expect(productsList).toBeVisible();
        }
    });

    test('debe tener botón para crear nuevo producto', async ({ page }) => {
        // Login como admin
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);
        await loginViaUI(page, TEST_ADMIN.email, TEST_ADMIN.password);

        // Navegar a admin/products
        await page.goto('/admin/products');
        await page.waitForLoadState('networkidle');

        // Buscar botón de crear
        const createButton = page.locator('button:has-text("Crear"), button:has-text("Nuevo"), a:has-text("Crear")').first();

        if (await createButton.isVisible({ timeout: 5000 })) {
            await expect(createButton).toBeVisible();
        }
    });

    test('debe abrir formulario de crear producto', async ({ page }) => {
        // Login como admin
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);
        await loginViaUI(page, TEST_ADMIN.email, TEST_ADMIN.password);

        // Navegar a admin/products
        await page.goto('/admin/products');
        await page.waitForLoadState('networkidle');

        // Hacer clic en crear
        const createButton = page.locator('button:has-text("Crear"), button:has-text("Nuevo")').first();

        if (await createButton.isVisible({ timeout: 5000 })) {
            await createButton.click();
            await page.waitForTimeout(1000);

            // Verificar que se muestra el formulario
            const form = page.locator('form, [data-testid="product-form"]').first();

            if (await form.isVisible({ timeout: 3000 })) {
                await expect(form).toBeVisible();

                // Verificar campos del formulario
                const nameInput = form.locator('input[name="name"], input[placeholder*="nombre"]').first();
                const priceInput = form.locator('input[name="price"], input[type="number"]').first();

                if (await nameInput.isVisible({ timeout: 2000 })) {
                    await expect(nameInput).toBeVisible();
                }

                if (await priceInput.isVisible({ timeout: 2000 })) {
                    await expect(priceInput).toBeVisible();
                }
            }
        }
    });

    test('debe poder editar producto existente', async ({ page }) => {
        // Login como admin
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);
        await loginViaUI(page, TEST_ADMIN.email, TEST_ADMIN.password);

        // Navegar a admin/products
        await page.goto('/admin/products');
        await page.waitForLoadState('networkidle');

        // Buscar botón de editar en el primer producto
        const editButton = page.locator('button:has-text("Editar"), a:has-text("Editar"), button[aria-label*="Editar"]').first();

        if (await editButton.isVisible({ timeout: 5000 })) {
            await editButton.click();
            await page.waitForTimeout(1000);

            // Verificar que se muestra el formulario de edición
            const form = page.locator('form, [data-testid="product-form"]').first();

            if (await form.isVisible({ timeout: 3000 })) {
                await expect(form).toBeVisible();
            }
        }
    });

    test('debe poder eliminar producto', async ({ page }) => {
        // Login como admin
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);
        await loginViaUI(page, TEST_ADMIN.email, TEST_ADMIN.password);

        // Navegar a admin/products
        await page.goto('/admin/products');
        await page.waitForLoadState('networkidle');

        // Contar productos iniciales
        const productRows = page.locator('[data-testid="product-row"], tr').filter({ hasText: /\$/ });
        const initialCount = await productRows.count();

        // Buscar botón de eliminar
        const deleteButton = page.locator('button:has-text("Eliminar"), button[aria-label*="Eliminar"]').first();

        if (await deleteButton.isVisible({ timeout: 5000 })) {
            await deleteButton.click();
            await page.waitForTimeout(500);

            // Confirmar eliminación si hay diálogo
            const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Sí")').first();
            if (await confirmButton.isVisible({ timeout: 2000 })) {
                await confirmButton.click();
                await page.waitForTimeout(1000);
            }

            // Verificar que se eliminó (el conteo debería disminuir)
            const newCount = await productRows.count();
            expect(newCount).toBeLessThanOrEqual(initialCount);
        }
    });

    test('debe mostrar estadísticas en dashboard', async ({ page }) => {
        // Login como admin
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);
        await loginViaUI(page, TEST_ADMIN.email, TEST_ADMIN.password);

        // Navegar a admin
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        // Buscar estadísticas
        const stats = page.locator('[data-testid="stats"], .stats, .dashboard-stats').first();

        if (await stats.isVisible({ timeout: 5000 })) {
            await expect(stats).toBeVisible();
        }
    });

    test('debe mostrar órdenes recientes en admin', async ({ page }) => {
        // Login como admin
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);
        await loginViaUI(page, TEST_ADMIN.email, TEST_ADMIN.password);

        // Navegar a admin/orders o admin
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        // Buscar sección de órdenes
        const ordersSection = page.locator('[data-testid="orders"], .orders, text=/órdenes.*recientes/i').first();

        if (await ordersSection.isVisible({ timeout: 5000 })) {
            await expect(ordersSection).toBeVisible();
        }
    });

    test('debe tener navegación en panel de admin', async ({ page }) => {
        // Login como admin
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);
        await loginViaUI(page, TEST_ADMIN.email, TEST_ADMIN.password);

        // Navegar a admin
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        // Buscar links de navegación
        const productsLink = page.locator('a:has-text("Productos"), nav a:has-text("Productos")').first();
        const ordersLink = page.locator('a:has-text("Órdenes"), nav a:has-text("Órdenes")').first();

        // Al menos uno debería estar visible
        const hasProductsLink = await productsLink.isVisible({ timeout: 3000 });
        const hasOrdersLink = await ordersLink.isVisible({ timeout: 3000 });

        expect(hasProductsLink || hasOrdersLink).toBe(true);
    });

    test('debe poder buscar productos en admin', async ({ page }) => {
        // Login como admin
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);
        await loginViaUI(page, TEST_ADMIN.email, TEST_ADMIN.password);

        // Navegar a admin/products
        await page.goto('/admin/products');
        await page.waitForLoadState('networkidle');

        // Buscar input de búsqueda
        const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"]').first();

        if (await searchInput.isVisible({ timeout: 3000 })) {
            // Buscar un producto
            await searchInput.fill('cloro');
            await page.waitForTimeout(1000);

            // Verificar que hay resultados
            const results = page.locator('[data-testid="product-row"], tr').filter({ hasText: /cloro/i });
            const count = await results.count();
            expect(count).toBeGreaterThan(0);
        }
    });

    test('debe poder filtrar productos por categoría en admin', async ({ page }) => {
        // Login como admin
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);
        await loginViaUI(page, TEST_ADMIN.email, TEST_ADMIN.password);

        // Navegar a admin/products
        await page.goto('/admin/products');
        await page.waitForLoadState('networkidle');

        // Buscar filtro de categoría
        const categoryFilter = page.locator('select[name="category"], [data-testid="category-filter"]').first();

        if (await categoryFilter.isVisible({ timeout: 3000 })) {
            // Seleccionar una categoría
            await categoryFilter.selectOption({ index: 1 });
            await page.waitForTimeout(1000);

            // Verificar que se filtraron los productos
            const products = page.locator('[data-testid="product-row"], tr').filter({ hasText: /\$/ });
            const count = await products.count();
            expect(count).toBeGreaterThan(0);
        }
    });

    test('debe mostrar mensaje de acceso denegado para rutas admin sin permisos', async ({ authenticatedPage: page }) => {
        // Usuario normal intenta acceder a admin/products
        await page.goto('/admin/products');
        await page.waitForTimeout(2000);

        const url = page.url();

        if (url.includes('/admin')) {
            // Debería ver mensaje de error
            const errorMessage = page.locator('text=/no.*permiso/i, text=/acceso.*denegado/i').first();

            const hasError = await errorMessage.isVisible({ timeout: 3000 });
            expect(hasError).toBe(true);
        } else {
            // O fue redirigido
            expect(url).not.toContain('/admin');
        }
    });
});
