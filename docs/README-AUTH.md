# 🔐 Sistema de Autenticación con Refresh Tokens

## 📚 Documentación Completa

Este directorio contiene toda la documentación relacionada con el sistema de autenticación avanzada implementado en el proyecto.

---

## 📖 Índice de Documentos

### 1. **refresh-token-implementation-summary.md** 📋
**Resumen ejecutivo de la implementación**
- Estado actual del proyecto
- Archivos modificados
- Flujo de autenticación completo
- Configuración de seguridad
- Errores corregidos

👉 **Empieza aquí** para entender qué se ha implementado.

---

### 2. **frontend-refresh-token-integration.md** 🎨
**Guía completa de integración en Next.js**
- Código completo para `lib/api.ts`
- Actualización de `AuthContext`
- Componentes `RequireAuth` y `RequireAdmin`
- Ejemplos de uso en páginas
- Configuración de seguridad
- Troubleshooting

👉 **Usa este documento** para implementar el frontend.

---

### 3. **test-auth-flow.md** 🧪
**Guía de pruebas con cURL**
- Comandos cURL para cada endpoint
- Ejemplos de respuestas esperadas
- Pruebas de flujo completo
- Verificación de cookies

👉 **Usa este documento** para probar manualmente el backend.

---

### 4. **quick-test.http** ⚡
**Archivo de pruebas para VSCode REST Client**
- Pruebas rápidas de todos los endpoints
- Variables automáticas
- Extracción de tokens
- Pruebas de productos, carrito y órdenes

👉 **Instala la extensión "REST Client"** en VSCode y abre este archivo.

---

### 5. **test-with-curl.sh** 🐧
**Script automatizado de pruebas (Linux/Mac)**
- Prueba completa del flujo de autenticación
- Verificación automática de respuestas
- Reporte visual con emojis
- Limpieza automática

👉 **Ejecuta**: `bash docs/test-with-curl.sh`

---

### 6. **test-with-curl.ps1** 🪟
**Script automatizado de pruebas (Windows)**
- Mismas pruebas que el script bash
- Compatible con PowerShell
- Colores y formato visual

👉 **Ejecuta**: `.\docs\test-with-curl.ps1`

---

## 🚀 Inicio Rápido

### Backend (Ya Implementado ✅)

1. **Levantar servicios**:
   ```bash
   docker-compose up -d
   ```

2. **Iniciar API**:
   ```bash
   cd app/api
   npm install
   npm run start:dev
   ```

3. **Probar endpoints**:
   ```bash
   # Opción 1: Script automatizado
   bash docs/test-with-curl.sh
   
   # Opción 2: VSCode REST Client
   # Abre docs/quick-test.http
   
   # Opción 3: Manual con cURL
   # Sigue docs/test-auth-flow.md
   ```

---

### Frontend (Pendiente ⏳)

1. **Actualizar archivos**:
   - Sigue la guía en `frontend-refresh-token-integration.md`
   - Actualiza `lib/api.ts`
   - Actualiza `components/auth/authContext.tsx`
   - Crea `components/auth/RequireAuth.tsx`

2. **Iniciar frontend**:
   ```bash
   cd web
   npm install
   npm run dev
   ```

3. **Probar flujo completo**:
   - Login → http://localhost:3000/auth/login
   - Perfil → http://localhost:3000/profile
   - Admin → http://localhost:3000/admin

---

## 🔑 Características Implementadas

### ✅ Backend
- [x] Access tokens (15 minutos)
- [x] Refresh tokens (7 días)
- [x] Cookies httpOnly seguras
- [x] Hashing de refresh tokens en DB
- [x] Endpoint `/auth/login`
- [x] Endpoint `/auth/refresh`
- [x] Endpoint `/auth/logout`
- [x] Guards JWT y RefreshToken
- [x] CORS configurado
- [x] Invalidación en logout

### ⏳ Frontend
- [ ] Cliente API con interceptor
- [ ] Renovación automática de tokens
- [ ] AuthContext actualizado
- [ ] Componentes de protección de rutas
- [ ] Manejo de errores
- [ ] Página de login actualizada

---

## 🔒 Seguridad

### Implementado
✅ Refresh token en cookie httpOnly (no accesible desde JS)  
✅ Hashing con bcrypt en base de datos  
✅ Tokens separados con secrets diferentes  
✅ CORS con credentials habilitado  
✅ Cookie con sameSite='lax' (protección CSRF)  
✅ Secure=true en producción  
✅ Invalidación en logout  

### Recomendaciones Adicionales
- [ ] Rate limiting en endpoints de auth
- [ ] Captcha en login/registro
- [ ] 2FA (autenticación de dos factores)
- [ ] Logs de auditoría
- [ ] Detección de dispositivos sospechosos

---

## 📊 Flujo de Autenticación

```
┌─────────────┐                    ┌─────────────┐
│   Cliente   │                    │   Backend   │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │  1. POST /auth/login             │
       │  { email, password }             │
       ├─────────────────────────────────>│
       │                                  │
       │  2. Valida credenciales          │
       │     Genera tokens                │
       │     Guarda refresh_token hash    │
       │                                  │
       │  3. { access_token, user }       │
       │     Set-Cookie: refresh_token    │
       │<─────────────────────────────────┤
       │                                  │
       │  4. GET /protected               │
       │     Authorization: Bearer token  │
       ├─────────────────────────────────>│
       │                                  │
       │  5. Valida access_token          │
       │                                  │
       │  6. { data }                     │
       │<─────────────────────────────────┤
       │                                  │
       │  [15 minutos después]            │
       │                                  │
       │  7. GET /protected               │
       │     Authorization: Bearer token  │
       ├─────────────────────────────────>│
       │                                  │
       │  8. 401 Unauthorized             │
       │<─────────────────────────────────┤
       │                                  │
       │  9. POST /auth/refresh           │
       │     Cookie: refresh_token        │
       ├─────────────────────────────────>│
       │                                  │
       │  10. Valida refresh_token        │
       │      Genera nuevos tokens        │
       │                                  │
       │  11. { access_token, user }      │
       │      Set-Cookie: refresh_token   │
       │<─────────────────────────────────┤
       │                                  │
       │  12. Reintenta GET /protected    │
       │      Authorization: Bearer token │
       ├─────────────────────────────────>│
       │                                  │
       │  13. { data }                    │
       │<─────────────────────────────────┤
       │                                  │
```

---

## 🧪 Testing

### Pruebas Automatizadas

```bash
# Linux/Mac
bash docs/test-with-curl.sh

# Windows PowerShell
.\docs\test-with-curl.ps1
```

### Pruebas Manuales

```bash
# 1. Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# 2. Refresh
curl -X POST http://localhost:3001/auth/refresh \
  -b cookies.txt

# 3. Logout
curl -X POST http://localhost:3001/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -b cookies.txt
```

---

## 🐛 Troubleshooting

### Error: "Refresh token no encontrado"
**Causa**: Las cookies no se están enviando  
**Solución**: Verificar `credentials: 'include'` en el frontend

### Error: "Session expired"
**Causa**: El refresh token expiró (7 días)  
**Solución**: Usuario debe hacer login nuevamente

### Error: CORS
**Causa**: Configuración incorrecta de CORS  
**Solución**: Verificar `credentials: true` en backend y `credentials: 'include'` en frontend

### Error de compilación en auth.controller.ts
**Causa**: Uso incorrecto de HttpStatus  
**Solución**: Ya corregido - usar `UnauthorizedException` en lugar de `HttpStatus['UNAUTHORIZED']`

---

## 📞 Soporte

Si encuentras problemas:

1. ✅ Revisa esta documentación
2. ✅ Verifica variables de entorno en `.env`
3. ✅ Confirma que Docker Compose esté corriendo
4. ✅ Revisa logs del backend: `npm run start:dev`
5. ✅ Ejecuta los scripts de prueba automatizados

---

## 📝 Variables de Entorno

### Backend (`app/api/.env`)
```env
# JWT Access Token
JWT_SECRET=EsteEsUnSecretoSuperDificilDeAdivinar123
JWT_EXPIRATION_TIME=15m

# JWT Refresh Token
JWT_REFRESH_SECRET=OtroSecretoMuyDificilDeAdivinar456
JWT_REFRESH_EXPIRATION_TIME=7d

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=dev
DB_PASSWORD=devpass
DB_DATABASE=ecommerce
```

### Frontend (`web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🎯 Próximos Pasos

1. ✅ Backend completado
2. ⏳ Implementar frontend según `frontend-refresh-token-integration.md`
3. ⏳ Probar flujo completo end-to-end
4. ⏳ Agregar tests unitarios (opcional)
5. ⏳ Configurar para producción

---

## 📚 Referencias

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

---

**Estado**: ✅ Backend 100% funcional | ⏳ Frontend pendiente  
**Última actualización**: 2025-01-28  
**Versión**: 1.0.0
