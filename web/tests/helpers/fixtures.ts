import { test as base, Page } from '@playwright/test';
import { setupAuthState, clearAuthState, TEST_USER, TEST_ADMIN, registerUser } from './auth.helper';
import { clearCart } from './cart.helper';

/**
 * Fixtures personalizados para los tests
 */
type CustomFixtures = {
    authenticatedPage: Page;
    adminPage: Page;
    cleanCartPage: Page;
};

/**
 * Extend base test con fixtures personalizados
 */
export const test = base.extend<CustomFixtures>({
    /**
     * Fixture: Página con usuario normal autenticado
     */
    authenticatedPage: async ({ page }, use) => {
        // Setup: Registrar usuario si no existe y autenticar
        await registerUser(TEST_USER.email, TEST_USER.password);
        const success = await setupAuthState(page, TEST_USER.email, TEST_USER.password);

        if (!success) {
            throw new Error('Failed to setup authenticated user');
        }

        // Usar la página autenticada
        await use(page);

        // Teardown: Limpiar estado
        await clearAuthState(page);
    },

    /**
     * Fixture: Página con usuario admin autenticado
     */
    adminPage: async ({ page }, use) => {
        // Setup: Registrar admin si no existe y autenticar
        await registerUser(TEST_ADMIN.email, TEST_ADMIN.password);
        const success = await setupAuthState(page, TEST_ADMIN.email, TEST_ADMIN.password);

        if (!success) {
            throw new Error('Failed to setup admin user');
        }

        // Usar la página autenticada como admin
        await use(page);

        // Teardown: Limpiar estado
        await clearAuthState(page);
    },

    /**
     * Fixture: Página con carrito limpio
     */
    cleanCartPage: async ({ page }, use) => {
        // Setup: Limpiar carrito antes de usar
        await clearCart(page);

        // Usar la página con carrito limpio
        await use(page);

        // Teardown: Limpiar carrito después de usar
        await clearCart(page);
    },
});

export { expect } from '@playwright/test';
