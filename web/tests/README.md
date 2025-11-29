# 🧪 Pruebas E2E con Playwright

Sistema completo de pruebas End-to-End para el proyecto Shoping_Ecommerce.

## 📋 Contenido

- [Instalación](#instalación)
- [Estructura](#estructura)
- [Ejecutar Pruebas](#ejecutar-pruebas)
- [Suites de Pruebas](#suites-de-pruebas)
- [Helpers y Fixtures](#helpers-y-fixtures)
- [Configuración](#configuración)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Instalación

### 1. Instalar Playwright

```bash
cd web
npm install -D @playwright/test
npx playwright install
```

### 2. Instalar navegadores

```bash
npx playwright install chromium
```

Para instalar todos los navegadores (opcional):

```bash
npx playwright install
```

---

## 📁 Estructura

```
web/
├── tests/
│   ├── helpers/
│   │   ├── auth.helper.ts      # Funciones de autenticación
│   │   ├── cart.helper.ts      # Funciones del carrito
│   │   └── fixtures.ts         # Fixtures personalizados
│   ├── auth.spec.ts            # Tests de autenticación
│   ├── catalog.spec.ts         # Tests de catálogo
│   ├── cart.spec.ts            # Tests de carrito
│   ├── checkout.spec.ts        # Tests de checkout
│   ├── admin.spec.ts           # Tests de admin
│   └── README.md               # Este archivo
└── playwright.config.ts        # Configuración de Playwright
```

---

## ▶️ Ejecutar Pruebas

### Ejecutar todas las pruebas

```bash
cd web
npx playwright test
```

### Ejecutar una suite específica

```bash
# Tests de autenticación
npx playwright test auth.spec.ts

# Tests de catálogo
npx playwright test catalog.spec.ts

# Tests de carrito
npx playwright test cart.spec.ts

# Tests de checkout
npx playwright test checkout.spec.ts

# Tests de admin
npx playwright test admin.spec.ts
```

### Ejecutar un test específico

```bash
npx playwright test auth.spec.ts -g "debe hacer login"
```

### Modo interactivo (UI)

```bash
npx playwright test --ui
```

### Modo debug

```bash
npx playwright test --debug
```

### Ver reporte HTML

```bash
npx playwright show-report
```

### Ejecutar en modo headed (ver navegador)

```bash
npx playwright test --headed
```

### Ejecutar en navegador específico

```bash
# Chromium (default)
npx playwright test --project=chromium

# Firefox
npx playwright test --project=firefox

# WebKit (Safari)
npx playwright test --project=webkit
```

---

## 🧪 Suites de Pruebas

### 1. auth.spec.ts - Autenticación

**Cobertura:**
- ✅ Registro de usuarios
- ✅ Login con credenciales válidas
- ✅ Login con credenciales inválidas
- ✅ Logout
- ✅ Persistencia de sesión
- ✅ Renovación automática de tokens
- ✅ Protección de rutas
- ✅ Información de usuario en navbar

**Ejecutar:**
```bash
npx playwright test auth.spec.ts
```

---

### 2. catalog.spec.ts - Catálogo de Productos

**Cobertura:**
- ✅ Carga de lista de productos
- ✅ Información básica de productos
- ✅ Detalle de producto
- ✅ Cambio de cantidad
- ✅ Filtros por categoría
- ✅ Búsqueda de productos
- ✅ Productos destacados
- ✅ Productos en oferta
- ✅ Paginación
- ✅ Mensaje sin resultados

**Ejecutar:**
```bash
npx playwright test catalog.spec.ts
```

---

### 3. cart.spec.ts - Carrito de Compras

**Cobertura:**
- ✅ Carrito vacío inicial
- ✅ Agregar productos desde catálogo
- ✅ Agregar productos desde detalle
- ✅ Múltiples unidades
- ✅ Múltiples productos
- ✅ Actualizar cantidad
- ✅ Eliminar productos
- ✅ Cálculo de subtotal
- ✅ Cálculo de total con impuestos
- ✅ Badge de items en navbar
- ✅ Persistencia para usuarios autenticados
- ✅ Carrito temporal para visitantes
- ✅ Vaciar carrito
- ✅ Información de productos en carrito

**Ejecutar:**
```bash
npx playwright test cart.spec.ts
```

---

### 4. checkout.spec.ts - Checkout y Órdenes

**Cobertura:**
- ✅ Requerimiento de autenticación
- ✅ Crear orden desde carrito
- ✅ Resumen de orden
- ✅ Vaciar carrito después de orden
- ✅ Órdenes en perfil
- ✅ Detalles de orden
- ✅ Estado de orden
- ✅ Total de orden
- ✅ Fecha de orden
- ✅ Completar orden pendiente
- ✅ Flujo completo E2E

**Ejecutar:**
```bash
npx playwright test checkout.spec.ts
```

---

### 5. admin.spec.ts - Panel de Administración

**Cobertura:**
- ✅ Protección de rutas admin
- ✅ Acceso denegado a usuarios normales
- ✅ Acceso permitido a admins
- ✅ Lista de productos
- ✅ Crear producto
- ✅ Editar producto
- ✅ Eliminar producto
- ✅ Estadísticas en dashboard
- ✅ Órdenes recientes
- ✅ Navegación en panel
- ✅ Búsqueda de productos
- ✅ Filtros por categoría

**Ejecutar:**
```bash
npx playwright test admin.spec.ts
```

---

## 🛠️ Helpers y Fixtures

### Helpers

#### auth.helper.ts

Funciones para manejo de autenticación:

```typescript
// Login programático (API)
await loginViaAPI(email, password);

// Login a través de UI
await loginViaUI(page, email, password);

// Logout
await logoutViaUI(page);

// Configurar estado de autenticación
await setupAuthState(page, email, password);

// Verificar autenticación
await isAuthenticated(page);

// Limpiar estado
await clearAuthState(page);
```

#### cart.helper.ts

Funciones para manejo del carrito:

```typescript
// Limpiar carrito
await clearCart(page);

// Agregar producto
await addProductToCart(page, productName);
await addProductToCartFromDetail(page, productSlug, quantity);

// Obtener conteo de items
const count = await getCartItemCount(page);

// Verificar carrito vacío
await expectCartEmpty(page);

// Verificar carrito con items
await expectCartHasItems(page, minItems);

// Actualizar cantidad
await updateCartItemQuantity(page, productName, newQuantity);

// Eliminar item
await removeCartItem(page, productName);

// Obtener total
const total = await getCartTotal(page);
```

### Fixtures

#### authenticatedPage

Página con usuario normal autenticado:

```typescript
test('mi test', async ({ authenticatedPage: page }) => {
  // El usuario ya está autenticado
  await page.goto('/profile');
});
```

#### adminPage

Página con usuario admin autenticado:

```typescript
test('mi test', async ({ adminPage: page }) => {
  // El usuario admin ya está autenticado
  await page.goto('/admin');
});
```

#### cleanCartPage

Página con carrito limpio:

```typescript
test('mi test', async ({ cleanCartPage: page }) => {
  // El carrito está vacío
  await page.goto('/cart');
});
```

---

## ⚙️ Configuración

### playwright.config.ts

Configuración principal:

```typescript
{
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
}
```

### Variables de Entorno

Crear `.env.test` (opcional):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to http://localhost:3000"

**Solución:**
```bash
# Asegúrate de que el servidor de desarrollo esté corriendo
cd web
npm run dev
```

### Error: "Cannot connect to http://localhost:3001"

**Solución:**
```bash
# Asegúrate de que el backend esté corriendo
cd app/api
npm run start:dev
```

### Error: "Timeout waiting for element"

**Solución:**
- Aumenta el timeout en `playwright.config.ts`
- Verifica que los selectores sean correctos
- Usa `--headed` para ver qué está pasando

### Tests fallan aleatoriamente

**Solución:**
- Aumenta los `waitForTimeout` en helpers
- Usa `waitForLoadState('networkidle')`
- Verifica que el carrito se limpie correctamente

### Error: "Browser not found"

**Solución:**
```bash
npx playwright install chromium
```

---

## 📊 Reportes

### HTML Report

Después de ejecutar los tests:

```bash
npx playwright show-report
```

### JSON Report

Los resultados se guardan en:

```
test-results/results.json
```

### Screenshots y Videos

En caso de fallo, se guardan en:

```
test-results/
├── screenshots/
└── videos/
```

---

## 🎯 Mejores Prácticas

### 1. Usar Fixtures

```typescript
// ✅ Bueno
test('mi test', async ({ authenticatedPage: page }) => {
  // Usuario ya autenticado
});

// ❌ Malo
test('mi test', async ({ page }) => {
  await loginViaUI(page, email, password);
  // Repetir login en cada test
});
```

### 2. Limpiar Estado

```typescript
test.beforeEach(async ({ page }) => {
  await clearCart(page);
  await clearAuthState(page);
});
```

### 3. Usar Helpers

```typescript
// ✅ Bueno
await addProductToCart(page, 'Cloro hogar 1L');

// ❌ Malo
await page.goto('/catalogo');
await page.click('button:has-text("Agregar")');
// Código repetitivo
```

### 4. Esperar Correctamente

```typescript
// ✅ Bueno
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible();

// ❌ Malo
await page.waitForTimeout(5000); // Timeout fijo
```

### 5. Selectores Robustos

```typescript
// ✅ Bueno
page.locator('[data-testid="product-card"]')

// ⚠️ Aceptable
page.locator('.product-card')

// ❌ Malo
page.locator('div > div > div.card')
```

---

## 📝 Agregar Nuevos Tests

### 1. Crear archivo de test

```typescript
// tests/mi-feature.spec.ts
import { test, expect } from './helpers/fixtures';

test.describe('Mi Feature', () => {
  test('debe hacer algo', async ({ page }) => {
    await page.goto('/mi-ruta');
    // ... assertions
  });
});
```

### 2. Ejecutar

```bash
npx playwright test mi-feature.spec.ts
```

---

## 🔗 Referencias

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Selectors](https://playwright.dev/docs/selectors)

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa este README
2. Verifica que backend y frontend estén corriendo
3. Ejecuta con `--headed` para ver el navegador
4. Usa `--debug` para debugging interactivo

---

**Última actualización**: 2025-01-28  
**Versión**: 1.0.0
