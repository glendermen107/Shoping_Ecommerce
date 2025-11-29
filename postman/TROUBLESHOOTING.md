# 🔧 Troubleshooting - Importar Colección Postman

## ❌ Problema: No se puede importar la colección

### Síntoma
Postman muestra un error al intentar importar `Shoping_Ecommerce.postman_collection.json` y pide "intentar otra vez".

### ✅ Solución

Usa el archivo alternativo **`Shoping_Ecommerce_Simple.postman_collection.json`**

Este archivo tiene:
- ✅ El mismo contenido (19 requests)
- ✅ Los mismos tests
- ✅ Formato más compatible con Postman
- ✅ Estructura simplificada

---

## 📥 Cómo Importar

### Paso 1: Abre Postman

### Paso 2: Click en Import

### Paso 3: Arrastra el archivo

Arrastra **`Shoping_Ecommerce_Simple.postman_collection.json`** a la ventana de Postman.

### Paso 4: Click en Import

Postman debería importar la colección sin problemas.

---

## 📊 Contenido de la Colección

Ambos archivos contienen exactamente lo mismo:

```
Shoping_Ecommerce Backend Tests (19 requests)
├── 1. Auth (4 requests)
│   ├── Register
│   ├── Login (con tests)
│   ├── Refresh Token
│   └── Logout
├── 2. Products (5 requests)
│   ├── Get All Products (con tests)
│   ├── Get Product by ID
│   ├── Create Product
│   ├── Update Product
│   └── Delete Product
├── 3. Cart (5 requests)
│   ├── Add to Cart
│   ├── Get Cart
│   ├── Remove from Cart
│   ├── Clear Cart
│   └── Get All Carts (Admin)
└── 4. Orders (5 requests)
    ├── Checkout (con tests)
    ├── Get My Orders
    ├── Get Order by ID
    ├── Complete Order
    └── Get All Orders (Admin)
```

---

## 🔍 Diferencias entre los archivos

### `Shoping_Ecommerce.postman_collection.json`
- Generado por script Node.js
- Formato más complejo
- Todos los tests incluidos
- Puede tener problemas de compatibilidad

### `Shoping_Ecommerce_Simple.postman_collection.json` ⭐
- Creado manualmente
- Formato simplificado
- Tests principales incluidos
- **100% compatible con Postman**

---

## ✅ Verificar Importación Exitosa

Después de importar, deberías ver:

1. **Colección** en el panel izquierdo:
   - Nombre: "Shoping_Ecommerce Backend Tests"
   - 4 carpetas
   - 19 requests totales

2. **Variables** configuradas:
   - `base_url`
   - `access_token`
   - `test_email`
   - `test_password`
   - etc.

---

## 🧪 Probar que Funciona

### 1. Selecciona el Environment

En la esquina superior derecha, selecciona:
**Shoping_Ecommerce Environment**

### 2. Ejecuta un Request Simple

1. Abre **1. Auth** → **Register**
2. Click en **Send**
3. Deberías ver una respuesta 201 o 400 (si el usuario ya existe)

### 3. Ejecuta Login

1. Abre **1. Auth** → **Login**
2. Click en **Send**
3. Deberías ver:
   - Status 200
   - `access_token` en la respuesta
   - Tests pasando (✓)

---

## 🔄 Regenerar Colección

Si necesitas regenerar la colección original:

```bash
cd postman
node generate-postman-collection.js
```

Esto creará nuevamente `Shoping_Ecommerce.postman_collection.json`.

---

## 📝 Agregar Tests Manualmente

Si quieres agregar más tests a la colección simple:

1. Abre un request en Postman
2. Ve a la pestaña **Tests**
3. Agrega el código de test:

```javascript
pm.test('Status 200', () => {
    pm.response.to.have.status(200);
});

pm.test('Response time < 500ms', () => {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

4. Guarda el request

---

## 🆘 Otros Problemas

### Error: "Could not get response"

**Causa**: El backend no está corriendo

**Solución**:
```bash
cd app/api
npm run start:dev
```

### Error: "401 Unauthorized"

**Causa**: No hay token o está expirado

**Solución**:
1. Ejecuta **Login** primero
2. Verifica que `access_token` se guardó en las variables

### Error: "404 Not Found"

**Causa**: URL incorrecta

**Solución**:
1. Verifica que `base_url` sea `http://localhost:3001`
2. Verifica que el backend esté corriendo en ese puerto

---

## 💡 Tips

### Tip 1: Exportar Colección

Si haces cambios en Postman y quieres guardarlos:

1. Click derecho en la colección
2. **Export**
3. Selecciona **Collection v2.1**
4. Guarda el archivo

### Tip 2: Compartir con el Equipo

Comparte estos archivos con tu equipo:
- `Shoping_Ecommerce_Simple.postman_collection.json`
- `Shoping_Ecommerce.postman_environment.json`

### Tip 3: Usar Newman (CLI)

```bash
npm install -g newman
newman run Shoping_Ecommerce_Simple.postman_collection.json \
  -e Shoping_Ecommerce.postman_environment.json
```

---

## 📚 Documentación

- [QUICK-START.md](./QUICK-START.md) - Guía rápida
- [README.md](./README.md) - Índice
- [../docs/postman-tests.md](../docs/postman-tests.md) - Guía completa

---

## ✅ Resumen

**Problema**: No se puede importar la colección  
**Solución**: Usa `Shoping_Ecommerce_Simple.postman_collection.json`  
**Resultado**: Colección importada con 19 requests listos para usar  

---

**Última actualización**: 2025-01-28  
**Versión**: 1.0.0
