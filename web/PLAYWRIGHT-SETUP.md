# 🎭 Setup de Playwright - Guía de Instalación

## 📋 Requisitos Previos

Antes de instalar Playwright, asegúrate de tener:

- ✅ Node.js 18 o superior
- ✅ npm o yarn
- ✅ Backend corriendo en puerto 3001
- ✅ Frontend corriendo en puerto 3000

---

## 🚀 Instalación Paso a Paso

### 1. Instalar Dependencias

```bash
cd web
npm install
```

Esto instalará `@playwright/test` que ya está en `package.json`.

### 2. Instalar Navegadores

```bash
npx playwright install chromium
```

Para instalar todos los navegadores (opcional):

```bash
npx playwright install
```

### 3. Verificar Instalación

```bash
npx playwright --version
```

Deberías ver algo como:

```
Version 1.48.0
```

---

## ✅ Verificar que Todo Funciona

### 1. Levantar Servicios

#### Terminal 1: Backend

```bash
cd app/api
npm run start:dev
```

Espera a ver:

```
Application is running on: http://localhost:3001
```

#### Terminal 2: Frontend

```bash
cd web
npm run dev
```

Espera a ver:

```
- Local:        http://localhost:3000
```

### 2. Ejecutar Tests

#### Terminal 3: Tests

```bash
cd web
npm test
```

Deberías ver:

```
Running 64 tests using 4 workers

  ✓ auth.spec.ts (9 tests)
  ✓ catalog.spec.ts (12 tests)
  ✓ cart.spec.ts (18 tests)
  ✓ checkout.spec.ts (11 tests)
  ✓ admin.spec.ts (14 tests)

  64 passed (1m 43s)
```

---

## 🎯 Primeros Tests

### Test Rápido

```bash
# Ejecutar solo tests de autenticación
npm run test:auth
```

### Test con UI

```bash
# Ver tests en modo interactivo
npm run test:ui
```

### Test con Navegador Visible

```bash
# Ver el navegador mientras se ejecutan los tests
npm run test:headed
```

---

## 🐛 Solución de Problemas

### ❌ Error: "Cannot find module '@playwright/test'"

**Solución:**

```bash
cd web
npm install
```

### ❌ Error: "Executable doesn't exist"

**Solución:**

```bash
npx playwright install chromium
```

### ❌ Error: "Cannot connect to http://localhost:3000"

**Solución:**

```bash
# Asegúrate de que el frontend esté corriendo
cd web
npm run dev
```

### ❌ Error: "Cannot connect to http://localhost:3001"

**Solución:**

```bash
# Asegúrate de que el backend esté corriendo
cd app/api
npm run start:dev
```

### ❌ Error: "EADDRINUSE: address already in use"

**Solución:**

```bash
# Matar proceso en puerto 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 📚 Siguiente Paso

Una vez que todo funcione, lee:

1. **[tests/QUICK-START.md](./tests/QUICK-START.md)** - Comandos esenciales
2. **[tests/README.md](./tests/README.md)** - Documentación completa
3. **[tests/EXAMPLES.md](./tests/EXAMPLES.md)** - Ejemplos prácticos

---

## 🎉 ¡Listo!

Ya puedes ejecutar:

```bash
npm test
```

Y ver todos los tests en acción! 🚀

---

## 📞 Ayuda

Si tienes problemas:

1. Revisa [tests/README.md](./tests/README.md)
2. Ejecuta con `--headed` para ver qué pasa
3. Usa `--debug` para debugging interactivo

---

**Última actualización**: 2025-01-28
