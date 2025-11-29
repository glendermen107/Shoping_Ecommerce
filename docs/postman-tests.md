# 📮 Guía de Pruebas con Postman

## 🎯 Descripción

Colección completa de Postman para probar automáticamente todos los endpoints del backend NestJS de Shoping_Ecommerce.

---

## 📦 Contenido de la Colección

### 1. **Auth** (Autenticación)
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Renovar access token
- `POST /auth/logout` - Cerrar sesión

### 2. **Products** (Productos)
- `GET /products` - Listar todos los productos
- `GET /products/:id` - Obtener producto por ID
- `POST /products` - Crear producto (requiere auth)
- `PUT /products/:id` - Actualizar producto (requiere auth)
- `DELETE /products/:id` - Eliminar producto (requiere auth)

### 3. **Cart** (Carrito)
- `POST /cart` - Agregar producto al carrito
- `GET /cart` - Obtener carrito actual
- `DELETE /cart/:productId` - Eliminar producto del carrito
- `DELETE /cart` - Vaciar carrito completo
- `GET /cart/admin/all` - Ver todos los carritos (admin)

### 4. **Orders** (Órdenes)
- `POST /orders/checkout` - Crear orden desde carrito (requiere auth)
- `PATCH /orders/:id/complete` - Completar orden (requiere auth)
- `GET /orders/mine` - Ver mis órdenes (requiere auth)
- `GET /orders` - Ver todas las órdenes (admin)
- `GET /orders/:id` - Ver orden específica (requiere auth)

---

## 🚀 Instalación y Configuración

### Paso 1: Importar Colección

1. Abre Postman
2. Click en **Import**
3. Selecciona el archivo `postman/Shoping_Ecommerce.postman_collection.json`
4. Click en **Import**

### Paso 2: Importar Environment

1. Click en **Environments** (icono de engranaje)
2. Click en **Import**
3. Selecciona `postman/Shoping_Ecommerce.postman_environment.json`
4. Click en **Import**

### Paso 3: Activar Environment

1. En la esquina superior derecha, selecciona **Shoping_Ecommerce Environment**
2. Verifica que las variables estén configuradas

---

## ⚙️ Variables de Entorno

### Variables Principales

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `base_url` | `http://localhost:3001` | URL del backend |
| `access_token` | `` | Token de acceso (se llena automáticamente) |
| `test_email` | `test@example.com` | Email de prueba |
| `test_password` | `password123` | Contraseña de prueba |
| `admin_email` | `admin@example.com` | Email de admin |
| `admin_password` | `admin123` | Contraseña de admin |
| `product_id` | `` | ID de producto (se llena automáticamente) |
| `category_id` | `` | ID de categoría (se llena automáticamente) |
| `order_id` | `` | ID de orden (se llena automáticamente) |

### Modificar Variables

1. Click en el environment activo
2. Edita los valores según tu configuración
3. Guarda los cambios

---

## 🧪 Ejecutar Pruebas

### Opción 1: Ejecutar Request Individual

1. Selecciona un request de la colección
2. Click en **Send**
3. Verifica la respuesta y los tests en la pestaña **Test Results**

### Opción 2: Ejecutar Toda la Colección (Collection Runner)

1. Click derecho en la colección **Shoping_Ecommerce Backend Tests**
2. Selecciona **Run collection**
3. Configura las opciones:
   - **Iterations**: 1
   - **Delay**: 100ms (opcional)
   - **Data**: Ninguno (o archivo CSV/JSON si tienes)
4. Click en **Run Shoping_Ecommerce Backend Tests**
5. Espera a que terminen todas las pruebas

### Opción 3: Ejecutar Carpeta Específica

1. Click derecho en una carpeta (ej: **Auth**)
2. Selecciona **Run folder**
3. Click en **Run**

---

## 📊 Interpretar Resultados

### Tests Exitosos ✅

```
✓ Status 200 OK
✓ Response time < 500ms
✓ Has access_token
✓ Token saved to environment
```

### Tests Fallidos ❌

```
✗ Status 200 OK
  AssertionError: expected 401 to equal 200
```

### Métricas

- **Total Tests**: Número total de tests ejecutados
- **Passed**: Tests exitosos
- **Failed**: Tests fallidos
- **Skipped**: Tests omitidos
- **Avg Response Time**: Tiempo promedio de respuesta

---

## 🔐 Flujo de Autenticación

### 1. Registro

```http
POST /auth/register
Content-Type: application/json

{
  "email": "{{test_email}}",
  "password": "{{test_password}}"
}
```

**Tests Automáticos:**
- ✅ Status 201 Created
- ✅ Response time < 500ms
- ✅ Has user data

### 2. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "{{test_email}}",
  "password": "{{test_password}}"
}
```

**Tests Automáticos:**
- ✅ Status 200 OK
- ✅ Response time < 500ms
- ✅ Has access_token
- ✅ Token saved to environment

**Script de Test:**
```javascript
pm.test("Status 200 OK", function () {
    pm.response.to.have.status(200);
});

pm.test("Has access_token", function () {
    var json = pm.response.json();
    pm.expect(json).to.have.property("access_token");
    pm.environment.set("access_token", json.access_token);
});
```

### 3. Usar Token en Requests

Todas las requests protegidas incluyen automáticamente:

```
Authorization: Bearer {{access_token}}
```

### 4. Refresh Token

```http
POST /auth/refresh
Cookie: refresh_token=<httpOnly cookie>
```

**Nota**: El refresh token se maneja automáticamente por cookies httpOnly.

### 5. Logout

```http
POST /auth/logout
Authorization: Bearer {{access_token}}
```

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Flujo Completo de Compra

1. **Register** → Crear cuenta
2. **Login** → Obtener token
3. **GET /products** → Ver productos disponibles
4. **POST /cart** → Agregar productos al carrito
5. **GET /cart** → Verificar carrito
6. **POST /orders/checkout** → Crear orden
7. **GET /orders/mine** → Ver mis órdenes

### Ejemplo 2: Administración de Productos

1. **Login** (con credenciales de admin)
2. **POST /products** → Crear nuevo producto
3. **GET /products** → Verificar que se creó
4. **PUT /products/:id** → Actualizar producto
5. **DELETE /products/:id** → Eliminar producto

---

## 🧩 Tests Automatizados Incluidos

### Tests Comunes en Todos los Requests

```javascript
// Verificar status code
pm.test("Status code is correct", function () {
    pm.response.to.have.status(200);
});

// Verificar tiempo de respuesta
pm.test("Response time < 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Verificar Content-Type
pm.test("Content-Type is JSON", function () {
    pm.response.to.have.header("Content-Type", /json/);
});
```

### Tests Específicos por Endpoint

#### Login
```javascript
pm.test("Has access_token", function () {
    var json = pm.response.json();
    pm.expect(json).to.have.property("access_token");
    pm.environment.set("access_token", json.access_token);
});

pm.test("Has user data", function () {
    var json = pm.response.json();
    pm.expect(json.user).to.have.property("email");
    pm.expect(json.user).to.have.property("roles");
});
```

#### Get Products
```javascript
pm.test("Returns array of products", function () {
    var json = pm.response.json();
    pm.expect(json).to.be.an('array');
    pm.expect(json.length).to.be.above(0);
});

pm.test("Products have required fields", function () {
    var json = pm.response.json();
    var product = json[0];
    pm.expect(product).to.have.property("id");
    pm.expect(product).to.have.property("name");
    pm.expect(product).to.have.property("price");
});
```

#### Create Product
```javascript
pm.test("Product created successfully", function () {
    pm.response.to.have.status(201);
    var json = pm.response.json();
    pm.expect(json).to.have.property("id");
    pm.environment.set("product_id", json.id);
});
```

#### Add to Cart
```javascript
pm.test("Item added to cart", function () {
    var json = pm.response.json();
    pm.expect(json).to.have.property("items");
    pm.expect(json.items.length).to.be.above(0);
});

pm.test("Cart has totals", function () {
    var json = pm.response.json();
    pm.expect(json).to.have.property("subtotal");
    pm.expect(json).to.have.property("total");
});
```

---

## 🔄 Pre-request Scripts

### Auto-refresh Token (Opcional)

Puedes agregar este script en la colección para renovar automáticamente el token:

```javascript
// Pre-request Script a nivel de colección
const token = pm.environment.get("access_token");

if (!token) {
    console.log("No token found, skipping refresh");
    return;
}

// Verificar si el token está por expirar
// (Implementación depende de tu lógica de negocio)
```

---

## 📋 Checklist de Pruebas

### Autenticación
- [ ] Registro de usuario nuevo
- [ ] Login con credenciales válidas
- [ ] Login con credenciales inválidas (debe fallar)
- [ ] Refresh token
- [ ] Logout

### Productos
- [ ] Listar todos los productos
- [ ] Obtener producto por ID
- [ ] Crear producto (como admin)
- [ ] Actualizar producto (como admin)
- [ ] Eliminar producto (como admin)

### Carrito
- [ ] Agregar producto al carrito
- [ ] Ver carrito
- [ ] Actualizar cantidad
- [ ] Eliminar producto del carrito
- [ ] Vaciar carrito

### Órdenes
- [ ] Crear orden desde carrito
- [ ] Ver mis órdenes
- [ ] Ver orden específica
- [ ] Completar orden
- [ ] Ver todas las órdenes (como admin)

---

## 🐛 Troubleshooting

### Error: "Could not get response"

**Causa**: El backend no está corriendo

**Solución**:
```bash
cd app/api
npm run start:dev
```

### Error: "401 Unauthorized"

**Causa**: Token expirado o no válido

**Solución**:
1. Ejecuta el request **Login** nuevamente
2. Verifica que el token se guardó en las variables de entorno

### Error: "404 Not Found"

**Causa**: Endpoint incorrecto o recurso no existe

**Solución**:
1. Verifica la URL del request
2. Verifica que `base_url` esté configurado correctamente

### Error: "500 Internal Server Error"

**Causa**: Error en el servidor

**Solución**:
1. Revisa los logs del backend
2. Verifica que la base de datos esté corriendo
3. Verifica que los datos enviados sean válidos

---

## 📚 Recursos Adicionales

### Postman Documentation
- [Postman Learning Center](https://learning.postman.com/)
- [Writing Tests](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Variables](https://learning.postman.com/docs/sending-requests/variables/)

### Backend Documentation
- Ver `docs/refresh-token-implementation-summary.md`
- Ver `docs/test-auth-flow.md`

---

## 🎯 Mejores Prácticas

### 1. Usar Variables

```javascript
// ✅ Bueno
pm.environment.set("product_id", json.id);

// ❌ Malo
// Hardcodear valores
```

### 2. Tests Descriptivos

```javascript
// ✅ Bueno
pm.test("Product has valid price", function () {
    var json = pm.response.json();
    pm.expect(json.price).to.be.a('number');
    pm.expect(json.price).to.be.above(0);
});

// ❌ Malo
pm.test("Test 1", function () {
    pm.expect(true).to.be.true;
});
```

### 3. Limpiar Datos de Prueba

Después de ejecutar tests, considera limpiar:
- Usuarios de prueba creados
- Productos de prueba
- Órdenes de prueba

---

## 🚀 Integración Continua (CI/CD)

### Newman (CLI de Postman)

Instalar Newman:

```bash
npm install -g newman
```

Ejecutar colección:

```bash
newman run postman/Shoping_Ecommerce.postman_collection.json \
  -e postman/Shoping_Ecommerce.postman_environment.json \
  --reporters cli,json
```

### GitHub Actions

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Newman
        run: npm install -g newman
      - name: Run API Tests
        run: newman run postman/Shoping_Ecommerce.postman_collection.json
```

---

**Última actualización**: 2025-01-28  
**Versión**: 1.0.0
