# ⚡ Guía Rápida - Postman Tests

## 🚀 Setup en 3 Pasos

### 1. Generar Colección

```bash
cd postman
node generate-postman-collection.js
```

### 2. Importar en Postman

1. Abre Postman
2. Click en **Import**
3. Arrastra estos archivos:
   - `Shoping_Ecommerce_Simple.postman_collection.json` ⭐ (Usa este si el otro falla)
   - `Shoping_Ecommerce.postman_environment.json`
4. Click en **Import**

**Nota**: Si tienes problemas importando `Shoping_Ecommerce.postman_collection.json`, usa `Shoping_Ecommerce_Simple.postman_collection.json` que tiene el mismo contenido pero en formato más compatible.

### 3. Ejecutar Tests

1. Selecciona el environment **Shoping_Ecommerce Environment**
2. Click derecho en la colección
3. Selecciona **Run collection**
4. Click en **Run**

---

## 📋 Estructura de la Colección

```
Shoping_Ecommerce Backend Tests (19 requests)
├── Auth (4 requests)
│   ├── Register
│   ├── Login
│   ├── Refresh Token
│   └── Logout
├── Products (5 requests)
│   ├── Get All Products
│   ├── Get Product by ID
│   ├── Create Product
│   ├── Update Product
│   └── Delete Product
├── Cart (5 requests)
│   ├── Add to Cart
│   ├── Get Cart
│   ├── Remove from Cart
│   ├── Clear Cart
│   └── Get All Carts (Admin)
└── Orders (5 requests)
    ├── Checkout (Create Order)
    ├── Get My Orders
    ├── Get Order by ID
    ├── Complete Order
    └── Get All Orders (Admin)
```

---

## 🎯 Flujo Recomendado

### ⚠️ IMPORTANTE: Orden de Ejecución

Si ejecutas requests **individuales** (no toda la colección), debes seguir este orden:

#### 1. Autenticación (OBLIGATORIO PRIMERO)
1. **Register** → Crear cuenta (puede fallar si ya existe, está bien)
2. **Login** → ✅ **OBLIGATORIO** - Obtiene el token
3. **Refresh Token** → Renovar token (opcional)
4. **Logout** → Cerrar sesión (requiere haber hecho Login antes)

#### 2. Flujo Básico de Usuario

1. **Get All Products** → Ver productos (público)
2. **Add to Cart** → Agregar al carrito
3. **Get Cart** → Ver carrito
4. **Checkout** → Crear orden (requiere token)
5. **Get My Orders** → Ver órdenes (requiere token)

#### 3. Flujo Admin

1. **Login** (con credenciales admin)
2. **Create Product** → Crear producto (requiere admin)
3. **Get Product by ID** → Ver producto específico
4. **Update Product** → Actualizar (requiere admin)
5. **Get All Orders** → Ver todas las órdenes (requiere admin)
6. **Delete Product** → Eliminar (requiere admin)

### 💡 Tip: Ejecutar Toda la Colección

Para evitar problemas de orden, usa **Run collection** que ejecuta todo automáticamente en el orden correcto.

---

## ⚙️ Variables de Entorno

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `base_url` | `http://localhost:3001` | URL del backend |
| `access_token` | (auto) | Token de acceso |
| `test_email` | `test@example.com` | Email de prueba |
| `test_password` | `password123` | Contraseña |
| `product_id` | (auto) | ID de producto |
| `order_id` | (auto) | ID de orden |

---

## 🧪 Tests Automáticos

Cada request incluye tests que verifican:

✅ Status code correcto  
✅ Tiempo de respuesta < 500ms  
✅ Content-Type es JSON  
✅ Estructura de respuesta válida  
✅ Datos guardados en variables  

---

## 📊 Interpretar Resultados

### Exitoso ✅

```
✓ Status 200
✓ Response time < 500ms
✓ Content-Type is JSON
✓ Has access_token
```

### Fallido ❌

```
✗ Status 200
  AssertionError: expected 401 to equal 200
```

---

## 🐛 Troubleshooting

### Error: "Could not get response"

```bash
# Asegúrate de que el backend esté corriendo
cd app/api
npm run start:dev
```

### Error: "401 Unauthorized" en Logout

**Causa:** No has ejecutado Login antes de Logout  
**Solución:**
1. Ejecuta **Auth → Login** primero
2. Luego ejecuta **Auth → Logout**
3. El token se guarda automáticamente después del login

### Error: "401 Unauthorized" en otros endpoints

1. Ejecuta **Login** nuevamente
2. Verifica que el token se guardó en la variable `access_token`
3. Verifica que el endpoint requiere autenticación

### Error: "403 Forbidden" en Register

**Causa:** El usuario ya existe en la base de datos  
**Solución:** Esto es normal, continúa con Login

### Error: "400 Bad Request - slug must be a string"

**Causa:** Falta el campo `slug` en el producto  
**Solución:** Ya está corregido en la colección actualizada

### Error: "404 Not Found" en Update/Delete Product

**Causa:** No hay un `product_id` guardado  
**Solución:**
1. Ejecuta **Products → Get All Products** primero
2. O ejecuta **Products → Create Product**
3. El ID se guardará automáticamente

### Error: "404 Not Found" en endpoints

1. Verifica `base_url` en el environment
2. Verifica que el endpoint sea correcto
3. Verifica que el backend esté corriendo

---

## 📚 Documentación Completa

Ver **`docs/postman-tests.md`** para:
- Guía detallada
- Todos los endpoints
- Ejemplos de uso
- Mejores prácticas

---

## 🎉 ¡Listo!

Ya puedes ejecutar:

```
Run collection → Run
```

Y ver todos los tests en acción! 🚀
