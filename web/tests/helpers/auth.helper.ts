import { Page, expect } from '@playwright/test';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Credenciales de prueba
 */
export const TEST_USER = {
    email: 'test@example.com',
    password: 'password123',
};

export const TEST_ADMIN = {
    email: 'admin@example.com',
    password: 'admin123',
};

/**
 * Registra un usuario en el backend
 */
export async function registerUser(email: string, password: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error registering user:', error);
        return false;
    }
}

/**
 * Login programático directo al backend
 * Retorna el access token y las cookies
 */
export async function loginViaAPI(email: string, password: string): Promise<{
    accessToken: string;
    user: any;
    cookies: string[];
} | null> {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const cookies = response.headers.get('set-cookie')?.split(',') || [];

        return {
            accessToken: data.access_token,
            user: data.user,
            cookies,
        };
    } catch (error) {
        console.error('Error logging in via API:', error);
        return null;
    }
}

/**
 * Login a través de la UI
 */
export async function loginViaUI(page: Page, email: string, password: string): Promise<boolean> {
    try {
        await page.goto('/auth/login');

        // Llenar formulario
        await page.fill('input[type="email"]', email);
        await page.fill('input[type="password"]', password);

        // Hacer clic en el botón de login
        await page.click('button[type="submit"]');

        // Esperar redirección o mensaje de éxito
        await page.waitForURL(/\/(profile|admin|catalogo|$)/, { timeout: 5000 });

        return true;
    } catch (error) {
        console.error('Error logging in via UI:', error);
        return false;
    }
}

/**
 * Logout a través de la UI
 */
export async function logoutViaUI(page: Page): Promise<void> {
    try {
        // Buscar botón de logout en el navbar
        const logoutButton = page.locator('button:has-text("Cerrar sesión"), a:has-text("Cerrar sesión")').first();

        if (await logoutButton.isVisible({ timeout: 2000 })) {
            await logoutButton.click();
            await page.waitForTimeout(1000);
        }
    } catch (error) {
        console.error('Error logging out via UI:', error);
    }
}

/**
 * Configura el estado de autenticación en el navegador
 * Útil para tests que necesitan usuario autenticado sin pasar por login UI
 */
export async function setupAuthState(page: Page, email: string, password: string): Promise<boolean> {
    const authData = await loginViaAPI(email, password);

    if (!authData) {
        return false;
    }

    // Navegar a la página para establecer el contexto
    await page.goto('/');

    // Inyectar el access token en localStorage
    await page.evaluate((data) => {
        localStorage.setItem('authUser', JSON.stringify(data.user));
    }, authData);

    // Establecer cookies manualmente si es necesario
    // Las cookies httpOnly se manejan automáticamente por el navegador

    return true;
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
    try {
        const authUser = await page.evaluate(() => {
            return localStorage.getItem('authUser');
        });

        return authUser !== null;
    } catch {
        return false;
    }
}

/**
 * Limpia el estado de autenticación
 */
export async function clearAuthState(page: Page): Promise<void> {
    await page.evaluate(() => {
        localStorage.removeItem('authUser');
    });

    // Limpiar cookies
    const context = page.context();
    await context.clearCookies();
}

/**
 * Espera a que la autenticación se complete
 */
export async function waitForAuth(page: Page, timeout = 5000): Promise<boolean> {
    try {
        await page.waitForFunction(
            () => {
                return localStorage.getItem('authUser') !== null;
            },
            { timeout }
        );
        return true;
    } catch {
        return false;
    }
}
