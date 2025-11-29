# ⚡ Guía Rápida - Playwright Tests

## 🚀 Setup en 3 Pasos

### 1. Instalar Playwright

```bash
cd web
npm install
npx playwright install chromium
```

### 2. Levantar Servicios

```bash
# Terminal 1: Backend
cd app/api
npm run start:dev

# Terminal 2: Frontend
cd web
npm run dev
```

### 3. Ejecutar Tests

```bash
cd web
npm test
```

---

## 📋 Comandos Esenciales

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con UI interactiva
npm run test:ui

# Ver navegador mientras se ejecutan
npm run test:headed

# Debug interactivo
npm run test:debug

# Ver reporte HTML
npm run test:report
```

---

## 🎯 Ejecutar Suites Específicas

```bash
# Tests de autenticación
npm run test:auth

# Tests de catálogo
npm run test:catalog

# Tests de carrito
npm run test:cart

# Tests de checkout
npm run test:checkout

# Tests de admin
npm run test:admin
```

---

## 🧪 Ejecutar Test Individual

```bash
# Por nombre de archivo
npx playwright test auth.spec.ts

# Por nombre de test
npx playwright test -g "debe hacer login"

# Por suite
npx playwright test auth.spec.ts -g "Autenticación"
```

---

## 🔍 Debugging

### Modo UI (Recomendado)

```bash
npm run test:ui
```

Ventajas:
- Ver tests en tiempo real
- Inspeccionar elementos
- Ver timeline de acciones
- Reejecutar tests fácilmente

### Modo Debug

```bash
npm run test:debug
```

Ventajas:
- Pausar ejecución
- Inspeccionar estado
- Ejecutar paso a paso

### Modo Headed

```bash
npm run test:headed
```

Ventajas:
- Ver el navegador
- Identificar problemas visuales
- Verificar interacciones

---

## 📊 Ver Resultados

### Reporte HTML

```bash
npm run test:report
```

Abre automáticamente el navegador con:
- Resumen de tests
- Tests fallidos con detalles
- Screenshots de errores
- Videos de ejecución
- Traces para debugging

### Resultados en Terminal

Los resultados se muestran automáticamente después de ejecutar:

```
Running 45 tests using 4 workers

  ✓ auth.spec.ts:10:3 › debe registrar un nuevo usuario (2s)
  ✓ auth.spec.ts:25:3 › debe hacer login con credenciales válidas (1s)
  ✗ auth.spec.ts:40:3 › debe fallar login con credenciales inválidas (500ms)

  45 passed (1m 30s)
  1 failed
```

---

## 🛠️ Troubleshooting Rápido

### ❌ Error: "Cannot connect to localhost:3000"

```bash
# Verificar que el frontend esté corriendo
cd web
npm run dev
```

### ❌ Error: "Cannot connect to localhost:3001"

```bash
# Verificar que el backend esté corriendo
cd app/api
npm run start:dev
```

### ❌ Error: "Browser not found"

```bash
# Instalar navegadores
npx playwright install
```

### ❌ Tests fallan aleatoriamente

```bash
# Ejecutar con más tiempo
npx playwright test --timeout=60000

# O ejecutar en modo headed para ver qué pasa
npm run test:headed
```

### ❌ Error: "Timeout waiting for element"

Posibles causas:
1. Selector incorrecto
2. Elemento no visible
3. Página no cargó completamente

Solución:
```bash
# Ejecutar en modo debug
npm run test:debug
```

---

## 📝 Estructura de Tests

```
tests/
├── helpers/
│   ├── auth.helper.ts      # Login, logout, etc.
│   ├── cart.helper.ts      # Agregar, eliminar, etc.
│   └── fixtures.ts         # Fixtures reutilizables
├── auth.spec.ts            # 9 tests
├── catalog.spec.ts         # 12 tests
├── cart.spec.ts            # 18 tests
├── checkout.spec.ts        # 11 tests
└── admin.spec.ts           # 14 tests
```

**Total: 64 tests**

---

## 🎯 Cobertura de Tests

### ✅ Autenticación (9 tests)
- Registro, login, logout
- Persistencia de sesión
- Renovación de tokens
- Protección de rutas

### ✅ Catálogo (12 tests)
- Lista de productos
- Detalle de producto
- Búsqueda y filtros
- Paginación

### ✅ Carrito (18 tests)
- Agregar/eliminar productos
- Actualizar cantidades
- Cálculos de totales
- Persistencia

### ✅ Checkout (11 tests)
- Crear órdenes
- Ver órdenes en perfil
- Estados de órdenes
- Flujo completo E2E

### ✅ Admin (14 tests)
- Protección de rutas
- CRUD de productos
- Dashboard
- Búsqueda y filtros

---

## 💡 Tips

### 1. Ejecutar Solo Tests Modificados

```bash
# Ejecutar solo tests que fallaron
npx playwright test --last-failed
```

### 2. Ejecutar en Paralelo

```bash
# Usar más workers
npx playwright test --workers=4
```

### 3. Generar Código de Test

```bash
# Playwright Codegen
npx playwright codegen http://localhost:3000
```

### 4. Ver Trace de Test Fallido

```bash
# Después de un fallo
npx playwright show-trace test-results/.../trace.zip
```

### 5. Ejecutar en Diferentes Navegadores

```bash
# Firefox
npx playwright test --project=firefox

# WebKit (Safari)
npx playwright test --project=webkit

# Todos
npx playwright test --project=chromium --project=firefox --project=webkit
```

---

## 📚 Recursos

- [README completo](./README.md)
- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

## 🎉 Listo!

Ya puedes ejecutar:

```bash
npm test
```

Y ver todos los tests en acción! 🚀
