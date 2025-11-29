# 📚 Ejemplos de Tests con Playwright

Guía práctica con ejemplos de cómo escribir tests para diferentes escenarios.

---

## 🎯 Test Básico

```typescript
import { test, expect } from './helpers/fixtures';

test('debe cargar la página de inicio', async ({ page }) => {
  await page.goto('/');
  
  // Verificar título
  await expect(page).toHaveTitle(/Cleaning Line GP/);
  
  // Verificar que hay contenido
  const heading = page.locator('h1').first();
  await expect(heading).toBeVisible();
});
```

---

## 🔐 Test con Autenticación

### Usando Fixture

```typescript
import { test, expect } from './helpers/fixtures';

test('debe acceder a perfil autenticado', async ({ authenticatedPage: page }) => {
  // El usuario ya está autenticado
  await page.goto('/profile');
  
  // Verificar que estamos en el perfil
  await expect(page).toHaveURL(/\/profile/);
  
  // Verificar contenido del perfil
  const email = page.locator('text=/test@example.com/i');
  await expect(email).toBeVisible();
});
```

### Login Manual

```typescript
import { test, expect } from './helpers/fixtures';
import { loginViaUI, TEST_USER } from './helpers/auth.helper';

test('debe hacer login y ver perfil', async ({ page }) => {
  // Login
  const success = await loginViaUI(page, TEST_USER.email, TEST_USER.password);
  expect(success).toBe(true);
  
  // Navegar a perfil
  await page.goto('/profile');
  
  // Verificar
  await expect(page).toHaveURL(/\/profile/);
});
```

---

## 🛒 Test de Carrito

### Agregar Producto

```typescript
import { test, expect } from './helpers/fixtures';
import { addProductToCartFromDetail, expectCartHasItems } from './helpers/cart.helper';

test('debe agregar producto al carrito', async ({ cleanCartPage: page }) => {
  // Agregar producto
  await addProductToCartFromDetail(page, 'cloro-hogar-1l', 2);
  
  // Verificar que se agregó
  await expectCartHasItems(page, 1);
  
  // Verificar cantidad
  await page.goto('/cart');
  const quantity = page.locator('input[type="number"]').first();
  await expect(quantity).toHaveValue('2');
});
```

### Eliminar Producto

```typescript
import { test, expect } from './helpers/fixtures';
import { addProductToCartFromDetail, removeCartItem, expectCartEmpty } from './helpers/cart.helper';

test('debe eliminar producto del carrito', async ({ cleanCartPage: page }) => {
  // Agregar producto
  await addProductToCartFromDetail(page, 'cloro-hogar-1l', 1);
  
  // Eliminar producto
  await removeCartItem(page, 'Cloro hogar 1L');
  
  // Verificar que está vacío
  await expectCartEmpty(page);
});
```

---

## 📝 Test de Formularios

### Llenar y Enviar Formulario

```typescript
import { test, expect } from './helpers/fixtures';

test('debe enviar formulario de contacto', async ({ page }) => {
  await page.goto('/contact');
  
  // Llenar formulario
  await page.fill('input[name="name"]', 'Juan Pérez');
  await page.fill('input[name="email"]', 'juan@example.com');
  await page.fill('textarea[name="message"]', 'Hola, tengo una consulta');
  
  // Enviar
  await page.click('button[type="submit"]');
  
  // Verificar mensaje de éxito
  const success = page.locator('text=/mensaje.*enviado/i');
  await expect(success).toBeVisible({ timeout: 5000 });
});
```

### Validación de Formulario

```typescript
import { test, expect } from './helpers/fixtures';

test('debe mostrar errores de validación', async ({ page }) => {
  await page.goto('/auth/register');
  
  // Intentar enviar sin llenar
  await page.click('button[type="submit"]');
  
  // Verificar errores
  const emailError = page.locator('text=/email.*requerido/i');
  await expect(emailError).toBeVisible();
  
  const passwordError = page.locator('text=/contraseña.*requerida/i');
  await expect(passwordError).toBeVisible();
});
```

---

## 🔍 Test de Búsqueda

```typescript
import { test, expect } from './helpers/fixtures';

test('debe buscar productos', async ({ page }) => {
  await page.goto('/catalogo');
  
  // Buscar
  const searchInput = page.locator('input[type="search"]');
  await searchInput.fill('cloro');
  await searchInput.press('Enter');
  
  // Esperar resultados
  await page.waitForLoadState('networkidle');
  
  // Verificar resultados
  const products = page.locator('[data-testid="product-card"]');
  const count = await products.count();
  expect(count).toBeGreaterThan(0);
  
  // Verificar que contienen el término
  const firstProduct = products.first();
  const text = await firstProduct.textContent();
  expect(text?.toLowerCase()).toContain('cloro');
});
```

---

## 🎨 Test de Interacciones UI

### Hover y Click

```typescript
import { test, expect } from './helpers/fixtures';

test('debe mostrar menú al hacer hover', async ({ page }) => {
  await page.goto('/');
  
  // Hacer hover en el menú
  const menuButton = page.locator('[data-testid="menu-button"]');
  await menuButton.hover();
  
  // Verificar que se muestra el dropdown
  const dropdown = page.locator('[data-testid="menu-dropdown"]');
  await expect(dropdown).toBeVisible();
  
  // Hacer clic en una opción
  await dropdown.locator('a:has-text("Productos")').click();
  
  // Verificar navegación
  await expect(page).toHaveURL(/\/catalogo/);
});
```

### Drag and Drop

```typescript
import { test, expect } from './helpers/fixtures';

test('debe reordenar items con drag and drop', async ({ page }) => {
  await page.goto('/admin/products');
  
  // Obtener items
  const firstItem = page.locator('[data-testid="product-row"]').first();
  const secondItem = page.locator('[data-testid="product-row"]').nth(1);
  
  // Drag and drop
  await firstItem.dragTo(secondItem);
  
  // Verificar nuevo orden
  await page.waitForTimeout(1000);
  const newFirstItem = page.locator('[data-testid="product-row"]').first();
  const text = await newFirstItem.textContent();
  
  // El primer item ahora debería ser diferente
  expect(text).not.toContain('Cloro hogar 1L');
});
```

---

## 📱 Test Responsive

```typescript
import { test, expect, devices } from '@playwright/test';

test('debe verse bien en mobile', async ({ browser }) => {
  // Crear contexto mobile
  const context = await browser.newContext({
    ...devices['iPhone 12'],
  });
  
  const page = await context.newPage();
  await page.goto('/');
  
  // Verificar que el menú hamburguesa está visible
  const hamburger = page.locator('[data-testid="mobile-menu-button"]');
  await expect(hamburger).toBeVisible();
  
  // Hacer clic en el menú
  await hamburger.click();
  
  // Verificar que se abre el menú
  const mobileMenu = page.locator('[data-testid="mobile-menu"]');
  await expect(mobileMenu).toBeVisible();
  
  await context.close();
});
```

---

## 🎭 Test con Mocks

### Mock de API

```typescript
import { test, expect } from './helpers/fixtures';

test('debe manejar error de API', async ({ page }) => {
  // Interceptar petición y devolver error
  await page.route('**/api/products', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });
  
  await page.goto('/catalogo');
  
  // Verificar mensaje de error
  const errorMessage = page.locator('text=/error.*cargar/i');
  await expect(errorMessage).toBeVisible();
});
```

### Mock de Respuesta

```typescript
import { test, expect } from './helpers/fixtures';

test('debe mostrar productos mockeados', async ({ page }) => {
  // Interceptar y devolver datos mock
  await page.route('**/api/products', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: 1, name: 'Producto Test', price: 1000 },
        { id: 2, name: 'Otro Producto', price: 2000 },
      ]),
    });
  });
  
  await page.goto('/catalogo');
  
  // Verificar que se muestran los productos mock
  const product = page.locator('text=Producto Test');
  await expect(product).toBeVisible();
});
```

---

## ⏱️ Test con Timeouts

### Esperar Elemento

```typescript
import { test, expect } from './helpers/fixtures';

test('debe esperar a que cargue el contenido', async ({ page }) => {
  await page.goto('/');
  
  // Esperar elemento específico
  await page.waitForSelector('[data-testid="product-grid"]', {
    timeout: 10000,
  });
  
  // Verificar que está visible
  const grid = page.locator('[data-testid="product-grid"]');
  await expect(grid).toBeVisible();
});
```

### Esperar Navegación

```typescript
import { test, expect } from './helpers/fixtures';

test('debe navegar después de hacer clic', async ({ page }) => {
  await page.goto('/');
  
  // Hacer clic y esperar navegación
  await Promise.all([
    page.waitForNavigation(),
    page.click('a:has-text("Productos")'),
  ]);
  
  // Verificar URL
  await expect(page).toHaveURL(/\/catalogo/);
});
```

---

## 🎬 Test de Flujos Completos

### Flujo E2E Completo

```typescript
import { test, expect } from './helpers/fixtures';
import { loginViaUI, TEST_USER, registerUser } from './helpers/auth.helper';
import { addProductToCartFromDetail } from './helpers/cart.helper';

test('flujo completo: registro → login → compra → orden', async ({ page }) => {
  // 1. Registro
  const uniqueEmail = `test-${Date.now()}@example.com`;
  await registerUser(uniqueEmail, 'password123');
  
  // 2. Login
  const loginSuccess = await loginViaUI(page, uniqueEmail, 'password123');
  expect(loginSuccess).toBe(true);
  
  // 3. Agregar productos
  await addProductToCartFromDetail(page, 'cloro-hogar-1l', 2);
  await addProductToCartFromDetail(page, 'detergente-liquido-3l', 1);
  
  // 4. Ir al carrito
  await page.goto('/cart');
  const cartItems = page.locator('[data-testid="cart-item"]');
  expect(await cartItems.count()).toBe(2);
  
  // 5. Checkout
  await page.click('button:has-text("Checkout")');
  await page.waitForTimeout(2000);
  
  // 6. Confirmar orden
  const confirmButton = page.locator('button:has-text("Confirmar")');
  if (await confirmButton.isVisible({ timeout: 3000 })) {
    await confirmButton.click();
    await page.waitForTimeout(2000);
  }
  
  // 7. Verificar orden en perfil
  await page.goto('/profile');
  const order = page.locator('[data-testid="order-item"]').first();
  await expect(order).toBeVisible({ timeout: 5000 });
});
```

---

## 🔄 Test con Retry Logic

```typescript
import { test, expect } from './helpers/fixtures';

test('debe reintentar en caso de fallo temporal', async ({ page }) => {
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      await page.goto('/');
      
      // Intentar encontrar elemento
      const element = page.locator('[data-testid="dynamic-content"]');
      await expect(element).toBeVisible({ timeout: 5000 });
      
      break; // Éxito, salir del loop
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw error; // Falló después de todos los intentos
      }
      
      // Esperar antes de reintentar
      await page.waitForTimeout(1000);
    }
  }
});
```

---

## 📸 Test con Screenshots

```typescript
import { test, expect } from './helpers/fixtures';

test('debe capturar screenshot de la página', async ({ page }) => {
  await page.goto('/');
  
  // Screenshot de página completa
  await page.screenshot({ path: 'screenshots/home.png', fullPage: true });
  
  // Screenshot de elemento específico
  const product = page.locator('[data-testid="product-card"]').first();
  await product.screenshot({ path: 'screenshots/product-card.png' });
  
  // Verificar algo
  await expect(product).toBeVisible();
});
```

---

## 🎯 Mejores Prácticas

### ✅ DO: Usar data-testid

```typescript
// ✅ Bueno
const button = page.locator('[data-testid="submit-button"]');

// ❌ Malo
const button = page.locator('div > div > button.btn-primary');
```

### ✅ DO: Usar Helpers

```typescript
// ✅ Bueno
await addProductToCart(page, 'Cloro hogar 1L');

// ❌ Malo
await page.goto('/catalogo');
await page.click('button:has-text("Agregar")');
// ... código repetitivo
```

### ✅ DO: Limpiar Estado

```typescript
// ✅ Bueno
test.beforeEach(async ({ page }) => {
  await clearCart(page);
  await clearAuthState(page);
});

// ❌ Malo
// No limpiar estado entre tests
```

### ✅ DO: Usar Fixtures

```typescript
// ✅ Bueno
test('mi test', async ({ authenticatedPage: page }) => {
  // Usuario ya autenticado
});

// ❌ Malo
test('mi test', async ({ page }) => {
  await loginViaUI(page, email, password);
  // Repetir en cada test
});
```

---

## 📚 Recursos

- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors](https://playwright.dev/docs/selectors)
- [Assertions](https://playwright.dev/docs/test-assertions)

---

**Última actualización**: 2025-01-28
