# Guía de Datos de Prueba (Seed)

## Fecha: 29 de Noviembre, 2025

## ¿Qué es el Seed?

El sistema de seed pobla la base de datos con datos de prueba iniciales para facilitar el desarrollo y testing. Incluye:

- **Usuarios** (admin, user, test)
- **Categorías** (6 categorías de productos)
- **Productos** (15 productos variados)

## 🚀 Cómo Ejecutar el Seed

### Opción 1: Comando NPM (Recomendado)

```bash
cd app/api
npm run seed
```

### Opción 2: Comando Directo

```bash
cd app/api
ts-node src/seed.ts
```

## 📊 Datos Creados

### 👤 Usuarios

| Email | Password | Roles | Descripción |
|-------|----------|-------|-------------|
| `admin@example.com` | `admin123` | admin, user | Usuario administrador con todos los permisos |
| `user@example.com` | `user123` | user | Usuario normal |
| `test@example.com` | `password123` | user | Usuario de prueba (ya existente) |

### 📁 Categorías

1. **Electrónica** (Featured)
2. **Ropa** (Featured)
3. **Hogar**
4. **Deportes**
5. **Libros**
6. **Juguetes**

### 📦 Productos (15 productos)

#### Electrónica
- **Laptop HP 15"** - $599,990 (Featured, En oferta 15%)
- **Mouse Inalámbrico Logitech** - $29,990
- **Teclado Mecánico RGB** - $89,990 (Featured)
- **Auriculares Bluetooth Sony** - $149,990 (En oferta 20%)

#### Ropa
- **Camiseta Básica Algodón** - $19,990
- **Jeans Slim Fit** - $49,990 (Featured, En oferta 25%)
- **Zapatillas Deportivas** - $79,990 (Featured)

#### Hogar
- **Cafetera Eléctrica** - $59,990
- **Juego de Sábanas Queen** - $39,990 (En oferta 10%)

#### Deportes
- **Pelota de Fútbol Profesional** - $34,990
- **Pesas Ajustables 20kg** - $129,990 (Featured)

#### Libros
- **El Principito** - $14,990
- **Cien Años de Soledad** - $19,990 (En oferta 15%)

#### Juguetes
- **LEGO Set Ciudad** - $69,990 (Featured)
- **Muñeca Barbie Fashionista** - $24,990

## 🔄 Comportamiento del Seed

### Primera Ejecución
- Crea todos los usuarios, categorías y productos
- Muestra logs detallados del proceso

### Ejecuciones Posteriores
- Detecta que ya hay datos en la base de datos
- Muestra mensaje: "Database is already seeded. Skipping..."
- No duplica datos

## 🧹 Limpiar la Base de Datos

Si quieres volver a ejecutar el seed desde cero:

### Opción 1: Eliminar y recrear la base de datos

```bash
# En PostgreSQL
psql -U postgres
DROP DATABASE your_database_name;
CREATE DATABASE your_database_name;
\q
```

### Opción 2: Eliminar tablas específicas

```bash
# Conectar a la base de datos
psql -U postgres -d your_database_name

# Eliminar datos (mantiene estructura)
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE users CASCADE;

# Salir
\q
```

### Opción 3: Reiniciar con Docker (si usas Docker)

```bash
docker-compose down -v
docker-compose up -d
```

Luego ejecuta el seed nuevamente:

```bash
cd app/api
npm run seed
```

## 🧪 Probar con Postman

Después de ejecutar el seed, puedes probar los endpoints:

### 1. Login como Admin

```json
POST http://localhost:3001/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 2. Crear Producto (requiere admin)

```json
POST http://localhost:3001/products
Authorization: Bearer {access_token}
{
  "name": "Nuevo Producto",
  "slug": "nuevo-producto",
  "description": "Descripción del producto",
  "price": 99990,
  "stock": 50,
  "categoryId": 1
}
```

### 3. Obtener Productos

```json
GET http://localhost:3001/products
```

Ahora deberías ver los 15 productos creados por el seed.

### 4. Agregar al Carrito

```json
POST http://localhost:3001/cart
{
  "productId": 1,
  "quantity": 2
}
```

## 📝 Notas Importantes

1. **Contraseñas Hasheadas**: Las contraseñas se hashean automáticamente gracias al hook `@BeforeInsert()` en la entidad User.

2. **Slugs Únicos**: Cada producto tiene un slug único para URLs amigables.

3. **Productos Featured**: Algunos productos están marcados como "featured" para destacarlos en el frontend.

4. **Ofertas**: Algunos productos tienen descuentos aplicados (`isOnSale` y `discountPercent`).

5. **Stock**: Todos los productos tienen stock disponible para pruebas.

6. **Imágenes Placeholder**: Las imágenes usan placeholders de `via.placeholder.com`. Puedes reemplazarlas con URLs reales.

## 🔧 Personalizar el Seed

Para agregar más datos o modificar los existentes, edita el archivo:

```
app/api/src/seed/seed.service.ts
```

### Agregar más categorías:

```typescript
const categoriesData = [
  { name: 'Nueva Categoría', isFeatured: true },
  // ... más categorías
];
```

### Agregar más productos:

```typescript
const productsData = [
  {
    name: 'Nuevo Producto',
    slug: 'nuevo-producto',
    description: 'Descripción',
    price: 99990,
    stock: 50,
    category: categories[0],
    isFeatured: false,
    isOnSale: false,
  },
  // ... más productos
];
```

## 🐛 Troubleshooting

### Error: "Database connection failed"
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `.env`

### Error: "Cannot find module"
- Ejecuta `npm install` en `app/api`

### Error: "Entity not found"
- Verifica que las entidades estén correctamente importadas en `seed.module.ts`

### El seed no crea datos
- Verifica que la base de datos esté vacía
- Revisa los logs para ver mensajes de error

## 📚 Referencias

- [TypeORM Seeding](https://typeorm.io/)
- [NestJS Database](https://docs.nestjs.com/techniques/database)
- Archivo de seed: `app/api/src/seed/seed.service.ts`
- Script de ejecución: `app/api/src/seed.ts`
