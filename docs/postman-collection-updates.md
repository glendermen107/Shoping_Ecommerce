# Actualizaciones de la Colección Postman

## Fecha: 28 de Noviembre, 2025

## Cambios Realizados

### 1. Tests Automáticos Agregados

#### Auth → Register
```javascript
// Maneja tanto el caso de usuario nuevo como usuario existente
if (pm.response.code === 403) {
    pm.test('User already exists (expected)', () => {
        pm.response.to.have.status(403);
    });
} else {
    pm.test('Status 201 Created', () => {
        pm.response.to.have.status(201);
    });
    pm.test('User created successfully', () => {
        const json = pm.response.json();
        pm.expect(json).to.have.property('email');
        pm.expect(json).to.have.property('id');
    });
}
```

#### Auth → Refresh Token
```javascript
pm.test('Status 200', () => {
    pm.response.to.have.status(200);
});

pm.test('Has new access_token', () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('access_token');
    pm.environment.set('access_token', json.access_token);
});
```

#### Auth → Logout
```javascript
pm.test('Status 200', () => {
    pm.response.to.have.status(200);
});

pm.test('Logout successful', () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('message');
    pm.expect(json.message).to.include('exitoso');
});
```

#### Products → Create Product
```javascript
pm.test('Status 201 Created', () => {
    pm.response.to.have.status(201);
});

pm.test('Product created', () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property('id');
    pm.environment.set('product_id', json.id);
});
```

### 2. Campo "slug" Agregado

**Antes:**
```json
{
    "name": "Producto de Prueba",
    "description": "Descripción del producto",
    "price": 9990,
    "stock": 100,
    "categoryId": 1
}
```

**Después:**
```json
{
    "name": "Producto de Prueba",
    "slug": "producto-de-prueba",
    "description": "Descripción del producto",
    "price": 9990,
    "stock": 100,
    "categoryId": 1
}
```

### 3. Documentación Actualizada

Se actualizó `postman/QUICK-START.md` con:
- Sección de orden de ejecución obligatorio
- Troubleshooting detallado para cada error común
- Explicación clara de por qué Logout requiere Login primero
- Soluciones para errores 401, 403, 400, 404

## Problemas Resueltos

### ✅ Error 500 en Register
- **Antes:** Fallaba con error interno del servidor
- **Después:** Funciona correctamente, retorna 201 o 403 si el usuario ya existe

### ✅ Error 500 en Logout
- **Antes:** Fallaba con error interno del servidor
- **Después:** Funciona correctamente cuando se ejecuta después de Login

### ✅ Error 400 en Create Product
- **Antes:** Faltaba el campo "slug"
- **Después:** Campo "slug" incluido en el request

### ✅ Error 401 en Logout
- **Antes:** No había documentación clara sobre el orden
- **Después:** Documentación clara que Logout requiere Login primero

## Flujo de Ejecución Correcto

### Opción 1: Run Collection (Recomendado)
1. Click derecho en la colección
2. "Run collection"
3. Click "Run"
4. Todo se ejecuta automáticamente en orden

### Opción 2: Requests Individuales
**Orden obligatorio:**
1. Auth → Register (puede fallar si ya existe)
2. Auth → Login ✅ (OBLIGATORIO)
3. Cualquier otro endpoint que requiera autenticación
4. Auth → Logout (requiere token del Login)

## Variables de Entorno Automáticas

La colección ahora guarda automáticamente:
- `access_token` después de Login y Refresh
- `product_id` después de Get All Products o Create Product
- `order_id` después de Checkout

## Tests Incluidos

Cada request ahora incluye tests que verifican:
- ✅ Status code correcto
- ✅ Estructura de respuesta válida
- ✅ Datos guardados en variables de entorno
- ✅ Mensajes de error apropiados

## Próximos Pasos

1. ✅ Backend corregido (Register y Logout funcionan)
2. ✅ Colección actualizada (tests y campo slug agregados)
3. ✅ Documentación actualizada (orden de ejecución claro)
4. 🔄 Probar la colección completa con "Run collection"

## Notas Importantes

- **Logout requiere Login primero** porque necesita el token de acceso
- **Register puede fallar con 403** si el usuario ya existe (esto es esperado)
- **Create Product requiere rol admin** (el usuario test@example.com es usuario normal)
- **Los IDs se guardan automáticamente** en variables de entorno para uso posterior

## Comandos Útiles

### Ejecutar con Newman (CLI)
```bash
cd postman
newman run Shoping_Ecommerce_Simple.postman_collection.json -e Shoping_Ecommerce.postman_environment.json
```

### Ver resultados detallados
```bash
newman run Shoping_Ecommerce_Simple.postman_collection.json -e Shoping_Ecommerce.postman_environment.json --reporters cli,json
```
