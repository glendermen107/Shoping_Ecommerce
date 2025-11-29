# Guía de Colección de Flujo Completo

## 📋 Descripción

La colección **Shoping_Ecommerce - Complete Flow** ejecuta un flujo completo de pruebas end-to-end que simula el comportamiento real de un usuario y un administrador en el sistema.

## 🎯 Características

### ✅ Captura Automática de IDs
- Los IDs de productos, órdenes y otros recursos se capturan automáticamente
- No necesitas configurar IDs manualmente
- Cada request usa los IDs capturados en requests anteriores

### ✅ Flujo Secuencial Completo
1. **Setup**: Ejecuta el seed para tener datos de prueba
2. **Usuario Regular**: Login, navegación, compra
3. **Administrador**: Gestión de órdenes y productos

### ✅ Pruebas Automatizadas
- 18 requests con assertions automáticas
- Validación de respuestas y estructura de datos
- Verificación de flujos completos

## 🚀 Cómo Ejecutar

### Opción 1: Con Newman (CLI)

```bash
# Ejecutar toda la colección
newman run postman/Shoping_Ecommerce_Complete_Flow.postman_collection.json -e postman/Shoping_Ecommerce.postman_environment.json

# Con reporte HTML
newman run postman/Shoping_Ecommerce_Complete_Flow.postman_collection.json -e postman/Shoping_Ecommerce.postman_environment.json -r html

# Con reporte detallado
newman run postman/Shoping_Ecommerce_Complete_Flow.postman_collection.json -e postman/Shoping_Ecommerce.postman_environment.json -r cli,html --reporter-html-export newman-report.html
```

### Opción 2: Con Postman Desktop

1. Importa la colección: `Shoping_Ecommerce_Complete_Flow.postman_collection.json`
2. Importa el environment: `Shoping_Ecommerce.postman_environment.json`
3. Selecciona el environment en el dropdown
4. Click en "Run collection"
5. Click en "Run Shoping_Ecommerce - Complete Flow"

## 📝 Flujo de Pruebas

### Fase 1: Setup (Request 1)
```
Setup - Execute Seed
└─ Ejecuta el seed para poblar la base de datos
```

### Fase 2: Usuario Regular (Requests 2-10)
```
1. Login as User
   └─ Captura: user_token, access_token

2. Get All Products
   └─ Captura: product_id_1, product_id_2, product_id_3

3. Get Product by ID
   └─ Valida estructura del producto

4. Add Product 1 to Cart
   └─ Agrega 2 unidades del producto 1

5. Add Product 2 to Cart
   └─ Agrega 1 unidad del producto 2

6. Get Cart
   └─ Valida que el carrito tenga items y total

7. Checkout - Create Order
   └─ Captura: order_id
   └─ Crea orden desde el carrito

8. Get My Orders
   └─ Valida que el usuario tenga órdenes

9. Get Order by ID
   └─ Obtiene detalles de la orden creada

10. Refresh Token
    └─ Renueva el access_token
```

### Fase 3: Administrador (Requests 11-18)
```
11. Login as Admin
    └─ Captura: admin_token

12. Get All Orders (Admin)
    └─ Lista todas las órdenes del sistema

13. Complete Order (Admin)
    └─ Marca la orden como completada

14. Get All Carts (Admin)
    └─ Lista todos los carritos

15. Create New Product (Admin)
    └─ Captura: new_product_id
    └─ Crea un producto de prueba

16. Update Product (Admin)
    └─ Actualiza el producto creado

17. Delete Product (Admin)
    └─ Elimina el producto de prueba

18. Logout User
    └─ Cierra sesión del usuario
```

## 📊 Variables Capturadas

La colección captura automáticamente estas variables en el environment:

| Variable | Capturada en | Usada en |
|----------|--------------|----------|
| `user_token` | Login as User | Logout User |
| `access_token` | Login as User/Admin | Todos los requests autenticados |
| `product_id_1` | Get All Products | Add to Cart, Get Product |
| `product_id_2` | Get All Products | Add to Cart |
| `product_id_3` | Get All Products | - |
| `product_id` | Get All Products | Requests genéricos |
| `order_id` | Checkout | Get Order, Complete Order |
| `admin_token` | Login as Admin | Requests de admin |
| `new_product_id` | Create Product | Update/Delete Product |

## ✅ Assertions Incluidas

Cada request incluye validaciones automáticas:

### Autenticación
- ✅ Status codes correctos (200, 201)
- ✅ Presencia de tokens
- ✅ Estructura de respuesta

### Productos
- ✅ Arrays no vacíos
- ✅ Campos requeridos presentes
- ✅ Tipos de datos correctos

### Carrito
- ✅ Items agregados correctamente
- ✅ Total calculado
- ✅ Estructura de cart items

### Órdenes
- ✅ Orden creada con ID
- ✅ Items transferidos del carrito
- ✅ Estados actualizados correctamente

### Admin
- ✅ Permisos de admin funcionando
- ✅ CRUD de productos completo
- ✅ Acceso a recursos globales

## 🎨 Ventajas sobre la Colección Simple

| Característica | Simple | Complete Flow |
|----------------|--------|---------------|
| Captura automática de IDs | ❌ | ✅ |
| Flujo secuencial | ❌ | ✅ |
| Setup automático (seed) | ❌ | ✅ |
| Pruebas de usuario y admin | ❌ | ✅ |
| Flujo completo de compra | ❌ | ✅ |
| CRUD completo de productos | ❌ | ✅ |
| Validaciones exhaustivas | Básicas | Completas |

## 🔧 Troubleshooting

### Error: "Cannot read property 'id' of undefined"
**Causa**: El seed no se ejecutó o la base de datos está vacía
**Solución**: 
```bash
curl http://localhost:3001/seed
# o
Invoke-WebRequest -Uri http://localhost:3001/seed -Method GET
```

### Error: 401 Unauthorized
**Causa**: Token expirado o no capturado
**Solución**: Ejecuta la colección desde el inicio para capturar nuevos tokens

### Error: 404 Not Found en productos
**Causa**: Los IDs no se capturaron correctamente
**Solución**: Verifica que "Get All Products" se ejecute antes de otros requests

### Error: 400 Bad Request en checkout
**Causa**: El carrito está vacío
**Solución**: Asegúrate de ejecutar "Add to Cart" antes de "Checkout"

## 📈 Resultados Esperados

Al ejecutar la colección completa, deberías ver:

```
┌─────────────────────────┬───────────────────┬──────────────────┐
│                         │          executed │           failed │
├─────────────────────────┼───────────────────┼──────────────────┤
│              iterations │                 1 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│                requests │                18 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│            test-scripts │                18 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│              assertions │               45+ │                0 │
└─────────────────────────┴───────────────────┴──────────────────┘
```

## 🎯 Casos de Uso

### Desarrollo
- Ejecuta después de cada cambio para validar que no rompiste nada
- Usa como smoke test antes de hacer commit

### CI/CD
- Integra en tu pipeline de CI/CD
- Ejecuta automáticamente en cada PR

### QA
- Valida flujos completos end-to-end
- Genera reportes HTML para documentación

### Demo
- Muestra el funcionamiento completo del sistema
- Valida que todos los endpoints funcionen

## 🔄 Mantenimiento

### Agregar Nuevos Tests
1. Agrega el request en la posición apropiada del flujo
2. Captura IDs necesarios en el script de test
3. Usa variables de environment para IDs
4. Agrega assertions para validar la respuesta

### Actualizar Tests Existentes
1. Modifica el request según los cambios en la API
2. Actualiza las assertions si cambia la estructura
3. Verifica que las variables capturadas sigan siendo correctas

## 📚 Recursos Adicionales

- [Documentación de Newman](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [Postman Test Scripts](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Variables en Postman](https://learning.postman.com/docs/sending-requests/variables/)

## 💡 Tips

1. **Ejecuta el seed primero**: Siempre asegúrate de tener datos de prueba
2. **Revisa los logs**: Newman muestra detalles de cada assertion
3. **Usa reportes HTML**: Más fáciles de compartir con el equipo
4. **Ejecuta en orden**: Los requests dependen unos de otros
5. **Limpia entre ejecuciones**: Si algo falla, ejecuta el seed de nuevo
