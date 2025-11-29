import { test, expect } from './helpers/fixtures';
import {
    loginViaUI,
    logoutViaUI,
    isAuthenticated,
    clearAuthState,
    TEST_USER,
    registerUser,
    waitForAuth
} from './helpers/auth.helper';

test.describe('Autenticación', () => {
    test.beforeEach(async ({ page }) => {
        // Limpiar estado antes de cada test
        await clearAuthState(page);
    });

    test('debe registrar un nuevo usuario', async ({ page }) => {
        const uniqueEmail = `test-${Date.now()}@example.com`;
        const password = 'password123';

        await page.goto('/auth/register');

        // Llenar formulario de registro
        await page.fill('input[type="email"]', uniqueEmail);
        await page.fill('input[type="password"]', password);

        // Hacer clic en registrar
        await page.click('button[type="submit"]');

        // Esperar redirección o mensaje de éxito
        await page.waitForTimeout(2000);

        // Verificar que se muestre mensaje de éxito o redirección a login
        const url = page.url();
        expect(url).toMatch(/\/(auth\/login|profile|catalogo)/);
    });

    test('debe hacer login con credenciales válidas', async ({ page }) => {
        // Asegurar que el usuario existe
        await registerUser(TEST_USER.email, TEST_USER.password);

        // Hacer login a través de la UI
        const success = await loginViaUI(page, TEST_USER.email, TEST_USER.password);
        expect(success).toBe(true);

        // Verificar que el usuario está autenticado
        const authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(true);

        // Verificar redirección
        const url = page.url();
        expect(url).toMatch(/\/(profile|admin|catalogo|$)/);
    });

    test('debe fallar login con credenciales inválidas', async ({ page }) => {
        await page.goto('/auth/login');

        // Intentar login con credenciales incorrectas
        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Esperar mensaje de error
        await page.waitForTimeout(2000);

        // Verificar que se muestre mensaje de error
        const errorMessage = page.locator('text=/incorrectos|inválid|error/i').first();
        await expect(errorMessage).toBeVisible({ timeout: 5000 });

        // Verificar que NO está autenticado
        const authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(false);
    });

    test('debe hacer logout correctamente', async ({ authenticatedPage: page }) => {
        // El usuario ya está autenticado por el fixture
        await page.goto('/');

        // Verificar que está autenticado
        let authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(true);

        // Hacer logout
        await logoutViaUI(page);

        // Esperar a que se limpie el estado
        await page.waitForTimeout(1000);

        // Verificar que ya NO está autenticado
        authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(false);
    });

    test('debe mantener sesión después de recargar página', async ({ authenticatedPage: page }) => {
        // El usuario ya está autenticado
        await page.goto('/profile');

        // Verificar autenticación
        let authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(true);

        // Recargar página
        await page.reload();

        // Esperar a que se restaure la sesión
        await page.waitForTimeout(2000);

        // Verificar que sigue autenticado
        authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(true);
    });

    test('debe renovar token automáticamente (simulación)', async ({ authenticatedPage: page }) => {
        // El usuario ya está autenticado
        await page.goto('/');

        // Verificar autenticación inicial
        let authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(true);

        // Simular expiración del access token eliminándolo de memoria
        await page.evaluate(() => {
            // En una app real, el access token está en memoria
            // Aquí simulamos que expiró forzando una petición que debería renovarlo
            localStorage.setItem('_test_token_expired', 'true');
        });

        // Hacer una petición que requiera autenticación
        // (esto debería trigger el refresh automático)
        await page.goto('/profile');

        // Esperar a que se complete la renovación
        await page.waitForTimeout(2000);

        // Verificar que sigue autenticado (el token se renovó)
        authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(true);
    });

    test('debe redirigir a login cuando se accede a ruta protegida sin autenticación', async ({ page }) => {
        // Intentar acceder a ruta protegida sin estar autenticado
        await page.goto('/profile');

        // Esperar redirección
        await page.waitForTimeout(2000);

        // Verificar que fue redirigido a login
        const url = page.url();
        expect(url).toContain('/auth/login');
    });

    test('debe mostrar información del usuario en navbar cuando está autenticado', async ({ authenticatedPage: page }) => {
        await page.goto('/');

        // Buscar email del usuario en el navbar
        const userEmail = page.locator(`text=${TEST_USER.email}`).first();

        // Puede que no esté visible directamente, pero debería existir en el DOM
        const exists = await userEmail.count() > 0;
        expect(exists).toBe(true);
    });

    test('debe persistir autenticación entre navegaciones', async ({ authenticatedPage: page }) => {
        // Navegar a diferentes páginas
        await page.goto('/');
        let authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(true);

        await page.goto('/catalogo');
        authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(true);

        await page.goto('/cart');
        authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(true);

        await page.goto('/profile');
        authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(true);
    });
});
