# ⚡ Referencia Rápida - Comandos y Snippets

## 🚀 Inicio Rápido

### Levantar el Proyecto
```bash
# 1. Servicios Docker
docker-compose up -d

# 2. Backend
cd app/api
npm install
npm run start:dev

# 3. Frontend (en otra terminal)
cd web
npm install
npm run dev
```

### Verificar Servicios
```bash
# PostgreSQL
docker exec -it postgres psql -U dev -d ecommerce

# Redis
docker exec -it redis redis-cli

# Meilisearch
curl http://localhost:7700/health

# MinIO
# Abrir http://localhost:9001 (admin/adminadmin)
```

---

## 🧪 Testing Rápido

### Script Automatizado
```bash
# Linux/Mac
bash docs/test-with-curl.sh

# Windows PowerShell
.\docs\test-with-curl.ps1
```

### Prueba Manual Rápida
```bash
# 1. Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt -v

# 2. Refresh
curl -X POST http://localhost:3001/auth/refresh \
  -b cookies.txt -v

# 3. Logout
curl -X POST http://localhost:3001/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -b cookies.txt
```

---

## 📝 Snippets de Código

### Backend - Proteger Ruta
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('protected')
getProtected(@Req() req) {
  return { user: req.user };
}
```

### Backend - Proteger con Rol
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get('admin-only')
getAdminOnly() {
  return { message: 'Admin access' };
}
```

### Frontend - Petición Protegida
```typescript
import { apiClient } from '@/lib/api';

// Automáticamente incluye token y maneja renovación
const data = await apiClient('/protected-endpoint');
```

### Frontend - Proteger Página
```typescript
import { RequireAuth } from '@/components/auth/RequireAuth';

export default function ProtectedPage() {
  return (
    <RequireAuth>
      <div>Contenido protegido</div>
    </RequireAuth>
  );
}
```

### Frontend - Proteger Página Admin
```typescript
import { RequireAdmin } from '@/components/auth/RequireAuth';

export default function AdminPage() {
  return (
    <RequireAdmin>
      <div>Panel de administración</div>
    </RequireAdmin>
  );
}
```

### Frontend - Usar Auth Context
```typescript
'use client';
import { useAuth } from '@/components/auth/authContext';

export default function MyComponent() {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>No autenticado</div>;
  }

  return (
    <div>
      <p>Hola, {user.email}</p>
      {isAdmin && <p>Eres administrador</p>}
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

---

## 🔧 Comandos de Desarrollo

### Backend
```bash
# Desarrollo con watch
npm run start:dev

# Build
npm run build

# Producción
npm run start:prod

# Tests
npm run test
npm run test:watch
npm run test:cov

# Lint
npm run lint

# Format
npm run format

# Seed database
npm run seed
```

### Frontend
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm run start

# Lint
npm run lint
```

### Docker
```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Limpiar todo
docker-compose down -v

# Reiniciar un servicio
docker-compose restart postgres
```

---

## 🗄️ Base de Datos

### Conectar a PostgreSQL
```bash
# Desde Docker
docker exec -it postgres psql -U dev -d ecommerce

# Desde host (si tienes psql instalado)
psql -h localhost -U dev -d ecommerce
```

### Queries Útiles
```sql
-- Ver usuarios
SELECT id, email, roles FROM users;

-- Ver refresh tokens (hasheados)
SELECT id, email, hashed_refresh_token FROM users;

-- Invalidar refresh token de un usuario
UPDATE users SET hashed_refresh_token = NULL WHERE id = 1;

-- Ver productos
SELECT * FROM products;

-- Ver carritos
SELECT * FROM carts;

-- Ver órdenes
SELECT * FROM orders;
```

---

## 🍪 Verificar Cookies

### Chrome DevTools
```
1. F12 → Application → Cookies → http://localhost:3000
2. Buscar "refresh_token"
3. Verificar:
   - HttpOnly: ✓
   - Secure: ✓ (en producción)
   - SameSite: Lax
```

### cURL
```bash
# Ver cookies recibidas
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt -v

# Ver contenido del archivo
cat cookies.txt
```

---

## 🔍 Debugging

### Ver Logs del Backend
```bash
# En desarrollo (ya se muestran en consola)
npm run start:dev

# Ver logs de Docker
docker-compose logs -f api
```

### Verificar Variables de Entorno
```bash
# Backend
cat app/api/.env

# Frontend
cat web/.env.local
```

### Verificar Compilación
```bash
# Backend
cd app/api
npm run build

# Frontend
cd web
npm run build
```

---

## 📊 Endpoints Disponibles

### Autenticación
```
POST   /auth/register      - Registro
POST   /auth/login         - Login
POST   /auth/refresh       - Renovar token
POST   /auth/logout        - Cerrar sesión
```

### Usuarios
```
GET    /users/profile      - Ver perfil (autenticado)
PATCH  /users/profile      - Actualizar perfil (autenticado)
```

### Productos
```
GET    /products           - Listar productos
GET    /products/:id       - Ver producto
POST   /products           - Crear producto (admin)
PATCH  /products/:id       - Actualizar producto (admin)
DELETE /products/:id       - Eliminar producto (admin)
```

### Categorías
```
GET    /categories         - Listar categorías
GET    /categories/:id     - Ver categoría
POST   /categories         - Crear categoría (admin)
PATCH  /categories/:id     - Actualizar categoría (admin)
DELETE /categories/:id     - Eliminar categoría (admin)
```

### Carrito
```
GET    /cart               - Ver carrito
POST   /cart               - Agregar al carrito
DELETE /cart/:productId    - Eliminar del carrito
DELETE /cart               - Vaciar carrito
GET    /cart/all           - Ver todos los carritos (admin)
```

### Órdenes
```
POST   /orders             - Crear orden desde carrito
GET    /orders             - Ver mis órdenes
GET    /orders/:id         - Ver orden específica
PATCH  /orders/:id/complete - Completar orden
GET    /orders/all         - Ver todas las órdenes (admin)
```

---

## 🔐 Tokens de Ejemplo

### Estructura de Access Token (JWT)
```json
{
  "sub": 1,
  "email": "test@example.com",
  "roles": ["USER"],
  "iat": 1706400000,
  "exp": 1706400900
}
```

### Estructura de Refresh Token (JWT)
```json
{
  "sub": 1,
  "email": "test@example.com",
  "roles": ["USER"],
  "iat": 1706400000,
  "exp": 1707004800
}
```

---

## 🛠️ Troubleshooting Rápido

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Reiniciar PostgreSQL
docker-compose restart db
```

### Error: "CORS policy"
```typescript
// Verificar en app/api/src/main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### Error: "Refresh token no encontrado"
```bash
# Verificar que las cookies se estén enviando
# En frontend, verificar:
fetch(url, {
  credentials: 'include'  // ← Debe estar presente
})
```

### Error: "JWT malformed"
```bash
# Verificar variables de entorno
cat app/api/.env | grep JWT

# Deben estar definidas:
# JWT_SECRET
# JWT_REFRESH_SECRET
```

---

## 📚 Recursos Útiles

### Documentación
- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeORM Docs](https://typeorm.io)
- [Passport.js Docs](http://www.passportjs.org)

### Herramientas
- [JWT.io](https://jwt.io) - Decodificar tokens
- [Postman](https://www.postman.com) - Testing de API
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - VSCode extension

### Extensiones VSCode Recomendadas
- REST Client
- ESLint
- Prettier
- Docker
- PostgreSQL

---

## 🎯 Comandos de Un Solo Paso

### Setup Completo
```bash
# Clonar, instalar y levantar todo
git clone <repo>
cd <repo>
docker-compose up -d
cd app/api && npm install && npm run start:dev &
cd ../../web && npm install && npm run dev
```

### Limpiar y Reiniciar
```bash
# Limpiar todo y empezar de cero
docker-compose down -v
rm -rf app/api/node_modules web/node_modules
npm install
docker-compose up -d
```

### Probar Todo
```bash
# Ejecutar todas las pruebas
bash docs/test-with-curl.sh
```

---

**Última actualización**: 2025-01-28  
**Versión**: 1.0.0
