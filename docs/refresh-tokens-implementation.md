# 🔐 Implementación de Refresh Tokens - Guía Completa

## ✅ Estado de Implementación

### Backend (NestJS) - COMPLETADO

#### Características Implementadas:

1. **Refresh Tokens en Cookies httpOnly**
   - Los refresh tokens se envían en cookies seguras (httpOnly, sameSite: 'lax')
   - No se exponen en el body de las respuestas
   - Expiración: 7 días

2. **Access Tokens en Memoria**
   - Los access tokens se devuelven en el body de la respuesta
   - Expiración: 15 minutos
   - Se almacenan en memoria en el frontend (no en localStorage)

3. **Endpoints Implementados:**
   - `POST /auth/login` - Login con email y password
   - `POST /auth/register` - Registro de nuevos usuarios
   - `POST /auth/logout` - Cierre de sesión (limpia cookies)
   - `POST /auth/refresh` - Renovación automática de tokens

4. **Seguridad:**
   - Refresh tokens hasheados con bcrypt en la base de datos
   - CORS configurado con `credentials: true`
   - Cookies configuradas para producción (secure en HTTPS)

#### Archivos Modificados:

- `app/api/src/auth/auth.controller.ts` - Manejo de cookies
- `app/api/src/auth/auth.service.ts` - Lógica de tokens
- `app/api/src/auth/strategies/refresh-token.strategy.ts` - Extracción desde cookies
- `app/api/src/main.ts` - CORS y cookie-parser

---

### Frontend (Next.js) - COMPLETADO

#### Características Implementadas:

1. **Cliente API con Interceptor**
   - Función `apiClient()` que intercepta respuestas 401
   - Renovación automática de tokens
   - Reintentos automáticos después de refresh

2. **AuthContext Mejorado**
   - Access token en memoria (no en localStorage)
   - Verificación de sesión al cargar la app
   - Funciones de login, register y logout integradas con el backend

3. **Componentes de Protección:**
   - `<RequireAuth>` - Protege rutas que requieren autenticación
   - `<RequireAdmin>` - Protege rutas que requieren rol de administrador
   - Estados de carga con spinners

4. **Páginas Actualizadas:**
   - Login integrado con el backend
   - Registro integrado con el backend
   - Manejo de errores mejorado

#### Archivos Modificados:

- `web/lib/api.ts` - Cliente API con interceptor
- `web/components/auth/authContext.tsx` - Context con tokens
- `web/components/auth/RequireAuth.tsx` - Componentes de protección
- `web/app/auth/login/page.tsx` - Página de login
- `web/app/auth/register/page.tsx` - Página de registro
- `web/.env.local` - Variables de entorno

---

## 🚀 Cómo Usar

### 1. Iniciar el Backend

```bash
cd app/api
npm install
npm run start:dev
```

El backend estará disponible en `http://localhost:3001`

### 2. Iniciar el Frontend

```bash
cd web
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

### 3. Probar la Autenticación

#### Registro de Usuario:
1. Ir a `http://localhost:3000/auth/register`
2. Ingresar email y contraseña
3. Hacer clic en "Registrarme"

#### Login:
1. Ir a `http://localhost:3000/auth/login`
2. Ingresar credenciales
3. Hacer clic en "Ingresar"
4. Serás redirigido a `/profile`

#### Logout:
- Hacer clic en el botón de logout en el navbar
- La sesión se cerrará y las cookies se limpiarán

---

## 🔧 Configuración

### Variables de Entorno

#### Backend (`app/api/.env`):
```env
JWT_SECRET=EsteEsUnSecretoSuperDificilDeAdivinar123
JWT_EXPIRATION_TIME=15m
JWT_REFRESH_SECRET=OtroSecretoMuyDificilDeAdivinar456
JWT_REFRESH_EXPIRATION_TIME=7d
```

#### Frontend (`web/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🔐 Flujo de Autenticación

### Login:
1. Usuario envía email y password a `/auth/login`
2. Backend valida credenciales
3. Backend genera access_token y refresh_token
4. Backend envía:
   - `access_token` en el body de la respuesta
   - `refresh_token` en cookie httpOnly
5. Frontend guarda:
   - `access_token` en memoria
   - Datos del usuario en localStorage

### Peticiones Autenticadas:
1. Frontend envía `access_token` en header `Authorization: Bearer <token>`
2. Frontend envía cookies automáticamente (incluye refresh_token)
3. Si el access_token expiró (401):
   - Frontend llama a `/auth/refresh` automáticamente
   - Backend valida refresh_token desde la cookie
   - Backend genera nuevo access_token
   - Frontend reintenta la petición original

### Logout:
1. Frontend llama a `/auth/logout`
2. Backend invalida el refresh_token en la base de datos
3. Backend limpia la cookie
4. Frontend limpia el access_token de memoria
5. Frontend limpia datos del usuario de localStorage

---

## 🛡️ Seguridad

### Protección Implementada:

1. **Refresh Tokens:**
   - Almacenados en cookies httpOnly (no accesibles desde JavaScript)
   - Hasheados en la base de datos con bcrypt
   - Invalidados en logout

2. **Access Tokens:**
   - Almacenados en memoria (se pierden al cerrar la pestaña)
   - Corta duración (15 minutos)
   - No se almacenan en localStorage

3. **CORS:**
   - Configurado para aceptar solo `http://localhost:3000`
   - `credentials: true` para permitir cookies

4. **Cookies:**
   - `httpOnly: true` - No accesibles desde JavaScript
   - `secure: true` en producción - Solo HTTPS
   - `sameSite: 'lax'` - Protección contra CSRF

---

## 📝 Uso en Componentes

### Proteger una Página:

```tsx
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <div>Contenido protegido</div>
    </RequireAuth>
  );
}
```

### Proteger una Página de Admin:

```tsx
import { RequireAdmin } from "@/components/auth/RequireAuth";

export default function AdminPage() {
  return (
    <RequireAdmin>
      <div>Panel de administrador</div>
    </RequireAdmin>
  );
}
```

### Usar el Context de Autenticación:

```tsx
"use client";

import { useAuth } from "@/components/auth/authContext";

export default function MyComponent() {
  const { user, loading, logout, isAdmin } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <p>Email: {user?.email}</p>
      <p>Es admin: {isAdmin() ? "Sí" : "No"}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

### Hacer Peticiones Autenticadas:

```tsx
import { apiClient } from "@/lib/api";

// Petición GET
const response = await apiClient("/products");
const products = await response.json();

// Petición POST
const response = await apiClient("/orders", {
  method: "POST",
  body: JSON.stringify({ items: [...] }),
});
```

---

## 🐛 Troubleshooting

### Error: "Refresh token no encontrado"
- Asegúrate de que el backend esté corriendo
- Verifica que las cookies estén habilitadas en el navegador
- Revisa que CORS esté configurado correctamente

### Error: "Access token expirado"
- Esto es normal, el sistema debería renovarlo automáticamente
- Si persiste, verifica que `/auth/refresh` esté funcionando

### Error: "CORS policy"
- Verifica que `credentials: true` esté en el backend
- Asegúrate de usar `credentials: "include"` en las peticiones del frontend

---

## 🎯 Próximos Pasos

1. **Producción:**
   - Cambiar `secure: true` en las cookies
   - Usar HTTPS
   - Actualizar CORS para el dominio de producción

2. **Mejoras:**
   - Implementar rate limiting en login
   - Agregar 2FA (autenticación de dos factores)
   - Implementar "Remember me" con refresh tokens de mayor duración

3. **Testing:**
   - Tests unitarios para auth.service
   - Tests E2E para flujo de login/logout
   - Tests de seguridad

---

## 📚 Referencias

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
