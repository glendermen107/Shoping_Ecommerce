import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para pruebas E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './tests',

    /* Ejecutar tests en paralelo */
    fullyParallel: true,

    /* Fallar el build en CI si dejaste test.only */
    forbidOnly: !!process.env.CI,

    /* Reintentos en CI, ninguno en local */
    retries: process.env.CI ? 2 : 2,

    /* Número de workers */
    workers: process.env.CI ? 1 : undefined,

    /* Reporter */
    reporter: [
        ['html'],
        ['list'],
        ['json', { outputFile: 'test-results/results.json' }]
    ],

    /* Configuración compartida para todos los proyectos */
    use: {
        /* URL base para usar en navegación */
        baseURL: 'http://localhost:3000',

        /* Recolectar trace en el primer reintento de un test fallido */
        trace: 'on-first-retry',

        /* Screenshot en fallo */
        screenshot: 'only-on-failure',

        /* Video en fallo */
        video: 'retain-on-failure',

        /* Timeout para acciones */
        actionTimeout: 10000,

        /* Timeout para navegación */
        navigationTimeout: 30000,
    },

    /* Timeout global para cada test */
    timeout: 30000,

    /* Configurar proyectos para diferentes navegadores */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        // Descomentar para probar en más navegadores
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

        /* Test en mobile viewports */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },
    ],

    /* Ejecutar servidor de desarrollo antes de iniciar tests */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
});
