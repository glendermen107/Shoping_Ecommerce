# ✅ Checklist de Implementación - Sistema de Refresh Tokens

## 🎯 Objetivo
Implementar un sistema completo de autenticación con refresh tokens en NestJS + Next.js

---

## 📋 Backend (Completado)

### Configuración Inicial
- [x] Instalar dependencias necesarias
- [x] Configurar variables de entorno
- [x] Configurar TypeORM con PostgreSQL
- [x] Habilitar cookie-parser
- [x] Configurar CORS con credentials

### Entidades y DTOs
- [x] Agregar campo `hashedRefreshToken` a User entity
- [x] Configurar campo como nullable y select: false
- [x] Crear/verificar LoginDto
- [x] Crear/verificar RegisterAuthDto

### Estrategias Passport
- [x] Implementar JwtStrategy para access tokens
- [x] Implementar RefreshTokenStrategy para refresh tokens
- [x] Configurar extracción desde cookies
- [x] Configurar secrets separados

### Guards
- [x] Implementar JwtAuthGuard
- [x] Implementar RefreshTokenGuard
- [x] Configurar guards en módulo

### Servicio de Autenticación
- [x] Método `register()` - Crear usuarios
- [x] Método `login()` - Autenticar y generar tokens
- [x] Método `refreshTokens()` - Renovar tokens
- [x] Método `logout()` - Invalidar refresh token
- [x] Método privado `getTokens()` - Generar ambos tokens
- [x] Método privado `updateRefreshToken()` - Hash y guardar

### Controlador de Autenticación
- [x] Endpoint `POST /auth/register`
- [x] Endpoint `POST /auth/login` con cookie httpOnly
- [x] Endpoint `POST /auth/refresh` con validación
- [x] Endpoint `POST /auth/logout` con limpieza
- [x] Configurar cookies con opciones seguras

### Módulo de Autenticación
- [x] Registrar estrategias
- [x] Configurar JwtModule con secrets
- [x] Exportar servicios necesarios

### Configuración de Seguridad
- [x] JWT_SECRET configurado
- [x] JWT_REFRESH_SECRET configurado
- [x] Duración de tokens configurada (15m / 7d)
- [x] Cookie httpOnly habilitada
- [x] Cookie secure en producción
- [x] Cookie sameSite='lax'
- [x] CORS con credentials: true

### Testing Backend
- [x] Crear script de pruebas bash
- [x] Crear script de pruebas PowerShell
- [x] Crear archivo REST Client
- [x] Documentar pruebas manuales
- [x] Verificar todos los endpoints
- [x] Verificar cookies
- [x] Verificar invalidación

### Documentación Backend
- [x] Resumen de implementación
- [x] Guía de pruebas
- [x] Archivo de estado
- [x] README principal

---

## 📋 Frontend (Pendiente)

### Configuración Inicial
- [ ] Crear/actualizar `.env.local`
- [ ] Configurar NEXT_PUBLIC_API_URL
- [ ] Verificar dependencias instaladas

### Cliente API (`lib/api.ts`)
- [ ] Crear variable para almacenar access token en memoria
- [ ] Implementar función `setAccessToken()`
- [ ] Implementar función `clearAccessToken()`
- [ ] Implementar función `getAccessToken()`
- [ ] Implementar función `refreshAccessToken()`
- [ ] Implementar cliente `apiClient()` con interceptor
- [ ] Agregar lógica de renovación en 401
- [ ] Implementar cola de peticiones durante refresh
- [ ] Configurar `credentials: 'include'` en todas las peticiones
- [ ] Crear funciones de API:
  - [ ] `authAPI.login()`
  - [ ] `authAPI.register()`
  - [ ] `authAPI.logout()`
  - [ ] `authAPI.refresh()`
  - [ ] `productsAPI.*`
  - [ ] `cartAPI.*`
  - [ ] `ordersAPI.*`

### Context de Autenticación (`components/auth/authContext.tsx`)
- [ ] Actualizar estado para usar access token en memoria
- [ ] Implementar `useEffect` para restaurar sesión
- [ ] Llamar `/auth/refresh` al cargar la app
- [ ] Actualizar método `login()` para usar nuevo flujo
- [ ] Actualizar método `logout()` para limpiar tokens
- [ ] Mantener información del usuario en estado
- [ ] Exportar `isAuthenticated` y `isAdmin`

### Componentes de Protección
- [ ] Crear `components/auth/RequireAuth.tsx`
  - [ ] Verificar autenticación
  - [ ] Redirigir a login si no autenticado
  - [ ] Mostrar loading mientras verifica
- [ ] Crear `components/auth/RequireAdmin.tsx`
  - [ ] Verificar rol de admin
  - [ ] Redirigir si no es admin
  - [ ] Mostrar mensaje de error

### Página de Login
- [ ] Actualizar `app/auth/login/page.tsx`
- [ ] Usar `useAuth()` hook
- [ ] Llamar a `login()` del context
- [ ] Manejar errores apropiadamente
- [ ] Redirigir después de login exitoso
- [ ] Mostrar loading durante login

### Página de Registro
- [ ] Actualizar `app/auth/register/page.tsx`
- [ ] Usar `authAPI.register()`
- [ ] Manejar errores
- [ ] Redirigir a login después de registro

### Protección de Rutas
- [ ] Envolver `/profile` con `<RequireAuth>`
- [ ] Envolver `/admin/*` con `<RequireAdmin>`
- [ ] Envolver `/cart` con `<RequireAuth>`
- [ ] Envolver `/orders` con `<RequireAuth>`

### Navbar/Header
- [ ] Mostrar estado de autenticación
- [ ] Botón de login/logout
- [ ] Mostrar email del usuario
- [ ] Link a perfil si autenticado
- [ ] Link a admin si es admin

### Manejo de Errores
- [ ] Capturar errores de red
- [ ] Capturar errores de autenticación
- [ ] Mostrar mensajes apropiados
- [ ] Redirigir a login cuando sea necesario
- [ ] Limpiar estado en errores críticos

### Testing Frontend
- [ ] Probar flujo de login
- [ ] Probar renovación automática
- [ ] Probar logout
- [ ] Probar protección de rutas
- [ ] Probar con token expirado
- [ ] Probar con refresh token expirado
- [ ] Verificar cookies en DevTools

### Documentación Frontend
- [ ] Documentar cambios realizados
- [ ] Crear guía de uso
- [ ] Documentar troubleshooting

---

## 📋 Testing Integrado

### Pruebas End-to-End
- [ ] Login desde frontend
- [ ] Verificar cookie en navegador
- [ ] Hacer petición protegida
- [ ] Esperar expiración de access token
- [ ] Verificar renovación automática
- [ ] Hacer logout
- [ ] Verificar limpieza de cookies

### Pruebas de Seguridad
- [ ] Verificar que refresh token no sea accesible desde JS
- [ ] Verificar que access token no se guarde en localStorage
- [ ] Verificar CORS funcionando
- [ ] Verificar cookies secure en producción
- [ ] Verificar invalidación en logout

### Pruebas de UX
- [ ] Renovación transparente para el usuario
- [ ] No hay re-login innecesario
- [ ] Mensajes de error claros
- [ ] Loading states apropiados
- [ ] Redirecciones correctas

---

## 📋 Producción

### Backend
- [ ] Cambiar `synchronize: false` en TypeORM
- [ ] Configurar migraciones de base de datos
- [ ] Configurar variables de entorno de producción
- [ ] Habilitar HTTPS
- [ ] Configurar dominio en CORS
- [ ] Agregar rate limiting
- [ ] Configurar logs
- [ ] Configurar monitoreo

### Frontend
- [ ] Configurar NEXT_PUBLIC_API_URL de producción
- [ ] Verificar build de producción
- [ ] Configurar variables de entorno
- [ ] Optimizar bundle size
- [ ] Configurar CDN si es necesario

### Infraestructura
- [ ] Configurar SSL/TLS
- [ ] Configurar firewall
- [ ] Configurar backups de base de datos
- [ ] Configurar logs centralizados
- [ ] Configurar alertas
- [ ] Documentar proceso de deployment

---

## 📊 Progreso

```
Backend:     ████████████████████ 100% (32/32)
Frontend:    ░░░░░░░░░░░░░░░░░░░░   0% (0/40)
Testing:     ████████████░░░░░░░░  60% (6/10)
Producción:  ░░░░░░░░░░░░░░░░░░░░   0% (0/14)
```

**Total**: 38/96 tareas completadas (39.6%)

---

## 🎯 Siguiente Tarea

### Prioridad Alta 🔴
**Actualizar `lib/api.ts`**

1. Abrir `web/lib/api.ts`
2. Copiar código de `docs/frontend-refresh-token-integration.md`
3. Adaptar según necesidades específicas
4. Probar con endpoint de prueba

---

## 📝 Notas

### Decisiones de Diseño
- Access token: 15 minutos (balance seguridad/UX)
- Refresh token: 7 días (sesión persistente)
- Almacenamiento: memoria para access, httpOnly cookie para refresh
- Renovación: automática en interceptor

### Consideraciones de Seguridad
- Nunca exponer refresh token al cliente
- Siempre usar HTTPS en producción
- Implementar rate limiting en endpoints de auth
- Considerar 2FA para cuentas sensibles
- Logs de auditoría para acciones críticas

### Mejoras Futuras
- [ ] Implementar 2FA
- [ ] Agregar OAuth (Google, GitHub)
- [ ] Implementar "Remember me"
- [ ] Agregar detección de dispositivos
- [ ] Implementar revocación de tokens por dispositivo
- [ ] Agregar notificaciones de login
- [ ] Implementar límite de sesiones concurrentes

---

**Última actualización**: 2025-01-28  
**Versión**: 1.0.0
