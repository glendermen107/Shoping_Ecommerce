# Módulo de Categorías - COMPLETADO

## 📋 Resumen

Se implementó un módulo completo de CRUD de categorías, tanto en el backend (NestJS) como en el frontend (Next.js), permitiendo a los administradores gestionar las categorías de productos.

## ✅ BACKEND - Implementación Completa

### 1. Entidad Category Actualizada

**Archivo:** `app/api/src/products/entities/category.entity.ts`

```typescript
@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;  // ✨ NUEVO

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
```

**Cambios:**
- ✅ Agregado campo `slug` (único, generado automáticamente)
- ✅ Eliminados campos innecesarios (`isFeatured`, `isOnSale`, `discountPercent`)

---

### 2. DTOs Creados

**CreateCategoryDto** (`app/api/src/categories/dto/create-category.dto.ts`):
```typescript
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
```

**UpdateCategoryDto** (`app/api/src/categories/dto/update-category.dto.ts`):
```typescript
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
```

---

### 3. Servicio de Categorías

**Archivo:** `app/api/src/categories/categories.service.ts`

**Funcionalidades implementadas:**

#### `create(createCategoryDto)`
- Valida que el nombre sea único
- Genera slug automáticamente usando función `generateSlug()`
- Valida que el slug sea único
- Crea la categoría en la base de datos

**Generación de slug:**
```typescript
private generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '')    // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-')            // Reemplazar espacios con guiones
    .replace(/-+/g, '-');            // Eliminar guiones duplicados
}
```

**Ejemplos:**
- "Limpieza del Hogar" → "limpieza-del-hogar"
- "Cloro & Desinfectantes" → "cloro-desinfectantes"
- "Cuidado   Personal" → "cuidado-personal"

#### `findAll()`
- Obtiene todas las categorías
- Incluye conteo de productos asociados
- Retorna formato: `{ id, name, slug, productCount }`

#### `findOne(id)`
- Obtiene una categoría por ID
- Incluye relación con productos
- Lanza `NotFoundException` si no existe

#### `update(id, updateCategoryDto)`
- Actualiza el nombre de la categoría
- Regenera el slug automáticamente
- Valida que el nuevo nombre/slug no existan (excepto en la misma categoría)

#### `remove(id)`
- Elimina la categoría
- **Importante:** Actualiza productos asociados para que `category = null`
- Los productos NO se eliminan, solo pierden la categoría

---

### 4. Controlador de Categorías

**Archivo:** `app/api/src/categories/categories.controller.ts`

**Endpoints implementados:**

| Endpoint | Método | Autenticación | Descripción |
|----------|--------|---------------|-------------|
| `/categories` | POST | Admin | Crear categoría |
| `/categories` | GET | Público | Listar todas |
| `/categories/:id` | GET | Público | Obtener por ID |
| `/categories/:id` | PUT | Admin | Actualizar |
| `/categories/:id` | DELETE | Admin | Eliminar |

**Protección de rutas:**
- Endpoints de escritura (POST, PUT, DELETE): `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)`
- Endpoints de lectura (GET): Públicos

---

### 5. Módulo de Categorías

**Archivo:** `app/api/src/categories/categories.module.ts`

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
```

**Registrado en AppModule:**
```typescript
imports: [
  // ...
  CategoriesModule,
],
```

---

## ✅ FRONTEND - Implementación Completa

### 1. Servicio de API

**Archivo:** `web/lib/categoriesApi.ts`

**Funciones implementadas:**

```typescript
// Obtener todas las categorías
export async function getCategories(): Promise<Category[]>

// Obtener una categoría por ID
export async function getCategoryById(id: number): Promise<Category>

// Crear categoría (solo admin)
export async function createCategory(data: CreateCategoryDto): Promise<Category>

// Actualizar categoría (solo admin)
export async function updateCategory(id: number, data: UpdateCategoryDto): Promise<Category>

// Eliminar categoría (solo admin)
export async function deleteCategory(id: number): Promise<void>
```

**Tipos:**
```typescript
export type Category = {
  id: number;
  name: string;
  slug: string;
  productCount?: number;
};
```

---

### 2. Componente CategoryForm (Modal)

**Archivo:** `web/components/admin/CategoryForm.tsx`

**Características:**
- ✅ Modal con fondo oscuro y backdrop blur
- ✅ Campo de texto para el nombre
- ✅ Validación: nombre requerido
- ✅ Manejo de errores del backend
- ✅ Estado de carga (botón "Guardando...")
- ✅ Botones: Cancelar / Guardar
- ✅ Se usa tanto para crear como para editar

**Props:**
```typescript
type CategoryFormProps = {
  category?: Category | null;  // null = crear, Category = editar
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
};
```

---

### 3. Componente CategoryTable

**Archivo:** `web/components/admin/CategoryTable.tsx`

**Características:**
- ✅ Tabla responsive con columnas:
  - ID
  - Nombre
  - Slug (con fuente monospace)
  - Cantidad de productos (badge)
  - Acciones (Editar / Eliminar)
- ✅ Estado de carga
- ✅ Estado vacío con mensaje amigable
- ✅ Hover effects en filas
- ✅ Botones con colores distintivos (verde para editar, rojo para eliminar)

**Props:**
```typescript
type CategoryTableProps = {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isLoading?: boolean;
};
```

---

### 4. Página de Administración

**Archivo:** `web/app/admin/categories/page.tsx`

**Características:**
- ✅ Protegida con `RequireAdmin` (solo administradores)
- ✅ Header con título y botón "Nueva Categoría"
- ✅ Notificaciones de éxito/error (auto-ocultan en 3 segundos)
- ✅ Carga automática de categorías al montar
- ✅ Recarga automática después de crear/editar/eliminar

**Funcionalidades:**

#### Crear Categoría
1. Click en "Nueva Categoría"
2. Se abre modal con formulario vacío
3. Ingresar nombre
4. Click en "Guardar"
5. Backend genera slug automáticamente
6. Notificación de éxito
7. Tabla se actualiza

#### Editar Categoría
1. Click en "Editar" en la tabla
2. Se abre modal con datos de la categoría
3. Modificar nombre
4. Click en "Guardar"
5. Backend regenera slug
6. Notificación de éxito
7. Tabla se actualiza

#### Eliminar Categoría
1. Click en "Eliminar" en la tabla
2. Confirmación con mensaje:
   - Si tiene productos: "Esta categoría tiene X producto(s) asociado(s). Los productos quedarán sin categoría."
   - Si no tiene productos: "¿Estás seguro de eliminar [nombre]?"
3. Si confirma: elimina y actualiza tabla
4. Los productos asociados quedan con `category = null`

---

### 5. Navegación Admin

**Archivo:** `web/app/admin/layout.tsx`

**Cambio:**
```typescript
const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categorías" },  // ✨ NUEVO
  { href: "/admin/products", label: "Productos" },
  { href: "/admin/orders", label: "Órdenes" },
  { href: "/admin/customers", label: "Clientes (local)" },
];
```

---

## 📁 Archivos Creados/Modificados

### Backend:
1. ✅ `app/api/src/categories/categories.module.ts` - NUEVO
2. ✅ `app/api/src/categories/categories.controller.ts` - NUEVO
3. ✅ `app/api/src/categories/categories.service.ts` - NUEVO
4. ✅ `app/api/src/categories/dto/create-category.dto.ts` - NUEVO
5. ✅ `app/api/src/categories/dto/update-category.dto.ts` - NUEVO
6. ✅ `app/api/src/products/entities/category.entity.ts` - MODIFICADO (agregado slug)
7. ✅ `app/api/src/app.module.ts` - MODIFICADO (registrado CategoriesModule)

### Frontend:
8. ✅ `web/lib/categoriesApi.ts` - NUEVO
9. ✅ `web/components/admin/CategoryForm.tsx` - NUEVO
10. ✅ `web/components/admin/CategoryTable.tsx` - NUEVO
11. ✅ `web/app/admin/categories/page.tsx` - NUEVO
12. ✅ `web/app/admin/layout.tsx` - MODIFICADO (agregado link)

### Documentación:
13. ✅ `docs/CATEGORIAS-IMPLEMENTACION.md` - Este documento

---

## 🧪 Guía de Pruebas

### Prueba 1: Crear Categoría

```bash
# 1. Iniciar sesión como admin
http://localhost:3000/auth/login
Email: admin@test.com
Password: Admin123!

# 2. Ir al panel de categorías
http://localhost:3000/admin/categories

# 3. Click en "Nueva Categoría"
# 4. Ingresar nombre: "Limpieza del Hogar"
# 5. Click en "Guardar"
# 6. Verificar:
#    - Notificación de éxito
#    - Categoría aparece en la tabla
#    - Slug generado: "limpieza-del-hogar"
#    - Productos: 0
```

### Prueba 2: Editar Categoría

```bash
# 1. En la tabla, click en "Editar" en una categoría
# 2. Modificar nombre: "Limpieza Industrial"
# 3. Click en "Guardar"
# 4. Verificar:
#    - Notificación de éxito
#    - Nombre actualizado en la tabla
#    - Slug actualizado: "limpieza-industrial"
```

### Prueba 3: Eliminar Categoría Sin Productos

```bash
# 1. Crear una categoría nueva (sin productos)
# 2. Click en "Eliminar"
# 3. Confirmar en el diálogo
# 4. Verificar:
#    - Notificación de éxito
#    - Categoría desaparece de la tabla
```

### Prueba 4: Eliminar Categoría Con Productos

```bash
# 1. Asignar productos a una categoría (desde /admin/products)
# 2. Ir a /admin/categories
# 3. Click en "Eliminar" en la categoría con productos
# 4. Verificar mensaje:
#    "Esta categoría tiene X producto(s) asociado(s).
#     Los productos quedarán sin categoría."
# 5. Confirmar
# 6. Verificar:
#    - Categoría eliminada
#    - Productos siguen existiendo pero sin categoría
```

### Prueba 5: Validación de Nombre Único

```bash
# 1. Crear categoría "Hogar"
# 2. Intentar crear otra categoría "Hogar"
# 3. Verificar:
#    - Error: "Category with name 'Hogar' already exists"
#    - Categoría NO se crea
```

### Prueba 6: Generación de Slug

```bash
# Probar diferentes nombres y verificar slugs:

Nombre: "Limpieza del Hogar"
Slug esperado: "limpieza-del-hogar"

Nombre: "Cloro & Desinfectantes"
Slug esperado: "cloro-desinfectantes"

Nombre: "Cuidado   Personal"
Slug esperado: "cuidado-personal"

Nombre: "Artículos de Limpieza"
Slug esperado: "articulos-de-limpieza"
```

### Prueba 7: Endpoints Públicos vs Protegidos

```bash
# Endpoint público (sin autenticación):
curl http://localhost:3001/categories
# Debe funcionar ✅

# Endpoint protegido (sin autenticación):
curl -X POST http://localhost:3001/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
# Debe retornar 401 Unauthorized ✅

# Endpoint protegido (con token de usuario normal):
# Debe retornar 403 Forbidden ✅

# Endpoint protegido (con token de admin):
# Debe funcionar ✅
```

---

## 🔍 Verificación en Base de Datos

### Ver categorías en PostgreSQL:

```sql
-- Ver todas las categorías
SELECT * FROM categories;

-- Ver categorías con conteo de productos
SELECT 
  c.id,
  c.name,
  c.slug,
  COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name, c.slug
ORDER BY c.id;

-- Ver productos sin categoría
SELECT id, name, slug 
FROM products 
WHERE category_id IS NULL;
```

---

## 📊 Estructura de Datos

### Tabla `categories`:

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | integer | PRIMARY KEY, AUTO_INCREMENT |
| name | varchar(255) | UNIQUE, NOT NULL |
| slug | varchar(255) | UNIQUE, NOT NULL |

### Relación con `products`:

```sql
-- Relación: products.category_id → categories.id
-- ON DELETE: SET NULL (productos quedan sin categoría)
```

---

## 🎯 Casos de Uso

### Caso 1: Administrador crea categorías iniciales

1. Admin inicia sesión
2. Va a `/admin/categories`
3. Crea categorías:
   - "Cloro y Desinfectantes"
   - "Limpieza del Hogar"
   - "Cuidado Personal"
4. Las categorías están disponibles para asignar a productos

### Caso 2: Administrador reorganiza categorías

1. Admin decide renombrar "Limpieza del Hogar" a "Limpieza Doméstica"
2. Edita la categoría
3. El slug se actualiza automáticamente
4. Todos los productos mantienen la relación

### Caso 3: Administrador elimina categoría obsoleta

1. Admin decide eliminar "Categoría Vieja"
2. La categoría tiene 5 productos asociados
3. Sistema muestra advertencia
4. Admin confirma
5. Categoría se elimina
6. Los 5 productos quedan sin categoría (pueden reasignarse después)

---

## 🚨 Validaciones y Restricciones

### Backend:

✅ Nombre de categoría único
✅ Slug único (generado automáticamente)
✅ Solo administradores pueden crear/editar/eliminar
✅ Validación de longitud máxima (255 caracteres)
✅ Validación de campo requerido

### Frontend:

✅ Campo nombre requerido
✅ Solo administradores pueden acceder a `/admin/categories`
✅ Confirmación antes de eliminar
✅ Advertencia si la categoría tiene productos
✅ Manejo de errores del backend

---

## 🔧 Troubleshooting

### Problema: Error "Category with name already exists"

**Causa:** Ya existe una categoría con ese nombre

**Solución:** Usar un nombre diferente o editar la categoría existente

---

### Problema: Error "Category with slug already exists"

**Causa:** El slug generado ya existe (nombres muy similares)

**Solución:** Modificar el nombre para que genere un slug diferente

---

### Problema: No puedo eliminar una categoría

**Causa:** Posiblemente no tienes permisos de administrador

**Solución:** Verificar que estás logueado como admin

---

### Problema: Los productos no muestran la categoría

**Causa:** La relación no está cargada en el endpoint de productos

**Solución:** Verificar que el endpoint `GET /products` incluye la relación `category`

---

## 📈 Próximos Pasos

### Mejoras Sugeridas:

1. **Ordenamiento de categorías:** Agregar campo `order` para ordenar manualmente
2. **Categorías anidadas:** Implementar jerarquía (categorías padre/hijo)
3. **Imágenes de categoría:** Agregar campo `imageUrl`
4. **Descripción:** Agregar campo `description`
5. **Categorías destacadas:** Agregar campo `isFeatured`
6. **Búsqueda:** Agregar filtro de búsqueda en la tabla
7. **Paginación:** Si hay muchas categorías, implementar paginación
8. **Exportar/Importar:** Funcionalidad para exportar/importar categorías en CSV

---

**Fecha de implementación:** 2024
**Rama:** `feature/frontend-sync-step-1`
**Estado:** ✅ COMPLETADA
