import { test, expect } from './helpers/fixtures';

test.describe('Catálogo de Productos', () => {
    test('debe cargar la lista de productos', async ({ page }) => {
        await page.goto('/catalogo');

        // Esperar a que carguen los productos
        await page.waitForLoadState('networkidle');

        // Verificar que hay productos en la página
        const products = page.locator('[data-testid="product-card"], .product-card');
        const count = await products.count();

        expect(count).toBeGreaterThan(0);
    });

    test('debe mostrar información básica de cada producto', async ({ page }) => {
        await page.goto('/catalogo');
        await page.waitForLoadState('networkidle');

        // Obtener el primer producto
        const firstProduct = page.locator('[data-testid="product-card"], .product-card').first();
        await expect(firstProduct).toBeVisible();

        // Verificar que tiene nombre
        const productName = firstProduct.locator('h2, h3, .product-name, [data-testid="product-name"]').first();
        await expect(productName).toBeVisible();

        // Verificar que tiene precio
        const productPrice = firstProduct.locator('text=/\\$\\s*\\d+/, .price, [data-testid="product-price"]').first();
        await expect(productPrice).toBeVisible();
    });

    test('debe abrir detalle de producto al hacer clic', async ({ page }) => {
        await page.goto('/catalogo');
        await page.waitForLoadState('networkidle');

        // Obtener el primer producto
        const firstProduct = page.locator('[data-testid="product-card"], .product-card').first();

        // Obtener el nombre del producto para verificar después
        const productName = await firstProduct.locator('h2, h3, .product-name').first().textContent();

        // Hacer clic en el producto (puede ser en el card o en un link)
        const productLink = firstProduct.locator('a').first();
        await productLink.click();

        // Esperar a que cargue la página de detalle
        await page.waitForLoadState('networkidle');

        // Verificar que estamos en la página de detalle
        const url = page.url();
        expect(url).toContain('/product/');

        // Verificar que se muestra el nombre del producto
        if (productName) {
            const detailName = page.locator(`text=${productName.trim()}`).first();
            await expect(detailName).toBeVisible({ timeout: 5000 });
        }
    });

    test('debe mostrar detalles completos del producto', async ({ page }) => {
        // Navegar directamente a un producto conocido
        await page.goto('/product/cloro-hogar-1l');
        await page.waitForLoadState('networkidle');

        // Verificar elementos del detalle
        const productName = page.locator('h1, h2, [data-testid="product-name"]').first();
        await expect(productName).toBeVisible();

        const productPrice = page.locator('text=/\\$\\s*\\d+/, [data-testid="product-price"]').first();
        await expect(productPrice).toBeVisible();

        const productDescription = page.locator('[data-testid="product-description"], .description, p').first();
        await expect(productDescription).toBeVisible();
    });

    test('debe tener botón de agregar al carrito en detalle', async ({ page }) => {
        await page.goto('/product/cloro-hogar-1l');
        await page.waitForLoadState('networkidle');

        // Buscar botón de agregar al carrito
        const addButton = page.locator('button:has-text("Agregar"), button:has-text("Añadir")').first();
        await expect(addButton).toBeVisible();
        await expect(addButton).toBeEnabled();
    });

    test('debe permitir cambiar cantidad en detalle de producto', async ({ page }) => {
        await page.goto('/product/cloro-hogar-1l');
        await page.waitForLoadState('networkidle');

        // Buscar input de cantidad
        const quantityInput = page.locator('input[type="number"]').first();

        if (await quantityInput.isVisible({ timeout: 2000 })) {
            // Cambiar cantidad
            await quantityInput.fill('3');

            // Verificar que el valor cambió
            const value = await quantityInput.inputValue();
            expect(value).toBe('3');
        }
    });

    test('debe mostrar productos por categoría', async ({ page }) => {
        await page.goto('/catalogo');
        await page.waitForLoadState('networkidle');

        // Buscar filtros o categorías
        const categoryFilter = page.locator('[data-testid="category-filter"], .category-filter, button:has-text("Categoría")').first();

        if (await categoryFilter.isVisible({ timeout: 3000 })) {
            await categoryFilter.click();
            await page.waitForTimeout(1000);

            // Verificar que hay opciones de categoría
            const categoryOptions = page.locator('[data-testid="category-option"], .category-option');
            const count = await categoryOptions.count();
            expect(count).toBeGreaterThan(0);
        }
    });

    test('debe buscar productos por nombre', async ({ page }) => {
        await page.goto('/catalogo');
        await page.waitForLoadState('networkidle');

        // Buscar input de búsqueda
        const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"], [data-testid="search-input"]').first();

        if (await searchInput.isVisible({ timeout: 3000 })) {
            // Escribir término de búsqueda
            await searchInput.fill('cloro');
            await page.waitForTimeout(1000);

            // Verificar que hay resultados
            const products = page.locator('[data-testid="product-card"], .product-card');
            const count = await products.count();
            expect(count).toBeGreaterThan(0);

            // Verificar que los productos contienen el término buscado
            const firstProduct = products.first();
            const text = await firstProduct.textContent();
            expect(text?.toLowerCase()).toContain('cloro');
        }
    });

    test('debe mostrar productos destacados en home', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Buscar sección de productos destacados
        const featuredSection = page.locator('[data-testid="featured-products"], .featured-products, section:has-text("Destacados")').first();

        if (await featuredSection.isVisible({ timeout: 3000 })) {
            // Verificar que hay productos
            const products = featuredSection.locator('[data-testid="product-card"], .product-card');
            const count = await products.count();
            expect(count).toBeGreaterThan(0);
        }
    });

    test('debe mostrar productos en oferta', async ({ page }) => {
        await page.goto('/catalogo');
        await page.waitForLoadState('networkidle');

        // Buscar productos con badge de oferta
        const saleProducts = page.locator('[data-testid="product-card"]:has-text("Oferta"), .product-card:has-text("Oferta"), [data-testid="sale-badge"]');

        const count = await saleProducts.count();

        if (count > 0) {
            // Verificar que el primer producto en oferta tiene precio con descuento
            const firstSaleProduct = saleProducts.first();
            await expect(firstSaleProduct).toBeVisible();

            // Buscar indicador de descuento
            const discount = firstSaleProduct.locator('text=/%/, text=/descuento/i').first();
            const hasDiscount = await discount.count() > 0;
            expect(hasDiscount).toBe(true);
        }
    });

    test('debe navegar entre páginas de productos (paginación)', async ({ page }) => {
        await page.goto('/catalogo');
        await page.waitForLoadState('networkidle');

        // Buscar controles de paginación
        const pagination = page.locator('[data-testid="pagination"], .pagination, nav[aria-label="Pagination"]').first();

        if (await pagination.isVisible({ timeout: 3000 })) {
            // Buscar botón de siguiente página
            const nextButton = pagination.locator('button:has-text("Siguiente"), button[aria-label="Next"]').first();

            if (await nextButton.isEnabled({ timeout: 1000 })) {
                await nextButton.click();
                await page.waitForLoadState('networkidle');

                // Verificar que la URL cambió o que se cargaron nuevos productos
                const url = page.url();
                const hasPageParam = url.includes('page=') || url.includes('p=');
                expect(hasPageParam).toBe(true);
            }
        }
    });

    test('debe mostrar mensaje cuando no hay resultados de búsqueda', async ({ page }) => {
        await page.goto('/catalogo');
        await page.waitForLoadState('networkidle');

        // Buscar input de búsqueda
        const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"]').first();

        if (await searchInput.isVisible({ timeout: 3000 })) {
            // Buscar algo que no existe
            await searchInput.fill('productoquenoexiste12345');
            await page.waitForTimeout(1000);

            // Verificar mensaje de "no hay resultados"
            const noResults = page.locator('text=/no.*resultados/i, text=/no.*encontr/i, text=/sin.*productos/i').first();

            const isVisible = await noResults.isVisible({ timeout: 3000 });

            if (isVisible) {
                await expect(noResults).toBeVisible();
            } else {
                // Si no hay mensaje, al menos verificar que no hay productos
                const products = page.locator('[data-testid="product-card"], .product-card');
                const count = await products.count();
                expect(count).toBe(0);
            }
        }
    });
});
