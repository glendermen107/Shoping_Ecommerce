# 🧪 Pruebas del Sistema de Autenticación

## Checklist de Pruebas

### ✅ Preparación

1. **Iniciar servicios Docker:**
   ```bash
   docker-compose up -d
   ```

2. **Iniciar Backend:**
   ```bash
   cd app/api
   npm run start:dev
   ```

3. **Iniciar Frontend:**
   ```bash
   cd web
   npm run dev
   ```

---

### 🔐 Pruebas de Registro

#### Test 1: Registro exitoso
1. Ir a `http://localhost:3000/auth/register`
2. Ingresar:
   - Email: `test@example.com`
   - Password: `password123`
3. Hacer clic en "Registrarme"
4. **Resultado esperado:** Redirección a `/auth/login`

#### Test 2: Registro con email duplicado
1. Intentar registrar el mismo email nuevamente
2. **Resultado esperado:** Error "El correo ya está registrado"

---

### 🔑 Pruebas de Login

#### Test 3: Login exitoso
1. Ir a `http://localhost:3000/auth/login`
2. Ingresar:
   - Email: `test@example.com`
   - Password: `password123`
3. Hacer clic en "Ingresar"
4. **Resultado esperado:** 
   - Redirección a `/profile`
   - Cookie `refresh_token` visible en DevTools > Application > Cookies

#### Test 4: Login con credenciales incorrectas
1. Intentar login con password incorrecta
2. **Resultado esperado:** Error "Correo o contraseña incorrectos"

---

### 🔄 Pruebas de Refresh Token

#### Test 5: Renovación automática de token
1. Hacer login exitoso
2. Abrir DevTools > Network
3. Esperar 15 minutos (o modificar JWT_EXPIRATION_TIME a 30s para pruebas rápidas)
4. Hacer una petición a la API (ej: ir a `/catalogo`)
5. **Resultado esperado:**
   - Primera petición falla con 401
   - Petición automática a `/auth/refresh`
   - Reintento exitoso de la petición original

#### Test 6: Verificar cookie de refresh token
1. Hacer login
2. Abrir DevTools > Application > Cookies
3. Buscar cookie `refresh_token`
4. **Resultado esperado:**
   - Cookie existe
   - HttpOnly: ✓
   - Secure: ✓ (en producción)
   - SameSite: Lax
   - Expires: ~7 días

---

### 🚪 Pruebas de Logout

#### Test 7: Logout exitoso
1. Hacer login
2. Hacer clic en el botón de logout
3. **Resultado esperado:**
   - Redirección a `/`
   - Cookie `refresh_token` eliminada
   - No se puede acceder a rutas protegidas

#### Test 8: Intentar usar refresh token después de logout
1. Hacer login
2. Copiar el valor de la cookie `refresh_token`
3. Hacer logout
4. Intentar hacer una petición a `/auth/refresh` con el token copiado
5. **Resultado esperado:** Error 403 "Acceso denegado"

---

### 🛡️ Pruebas de Protección de Rutas

#### Test 9: Acceso a ruta protegida sin autenticación
1. Cerrar sesión (si está abierta)
2. Intentar acceder a `http://localhost:3000/profile`
3. **Resultado esperado:** Redirección a `/auth/login`

#### Test 10: Acceso a ruta de admin sin permisos
1. Hacer login con usuario normal
2. Intentar acceder a `http://localhost:3000/admin`
3. **Resultado esperado:** Redirección a `/`

#### Test 11: Acceso a ruta de admin con permisos
1. Crear usuario admin en la base de datos:
   ```sql
   UPDATE users SET roles = '{admin}' WHERE email = 'test@example.com';
   ```
2. Hacer login
3. Acceder a `http://localhost:3000/admin`
4. **Resultado esperado:** Acceso permitido

---

### 🔍 Pruebas de Seguridad

#### Test 12: Access token no en localStorage
1. Hacer login
2. Abrir DevTools > Application > Local Storage
3. **Resultado esperado:** No debe haber ningún token almacenado

#### Test 13: Refresh token no accesible desde JavaScript
1. Hacer login
2. Abrir DevTools > Console
3. Ejecutar: `document.cookie`
4. **Resultado esperado:** No debe mostrar el refresh_token

#### Test 14: CORS configurado correctamente
1. Intentar hacer una petición desde otro origen (ej: `http://localhost:3002`)
2. **Resultado esperado:** Error de CORS

---

### 📱 Pruebas de Persistencia

#### Test 15: Sesión persiste al recargar la página
1. Hacer login
2. Recargar la página (F5)
3. **Resultado esperado:** Usuario sigue autenticado

#### Test 16: Sesión persiste al cerrar y abrir pestaña
1. Hacer login
2. Cerrar la pestaña
3. Abrir nueva pestaña y navegar a `http://localhost:3000`
4. **Resultado esperado:** Usuario sigue autenticado (mientras el refresh token sea válido)

#### Test 17: Sesión expira después de 7 días
1. Hacer login
2. Modificar la fecha del sistema a +8 días
3. Recargar la página
4. **Resultado esperado:** Usuario debe hacer login nuevamente

---

### 🐛 Pruebas de Manejo de Errores

#### Test 18: Backend caído
1. Detener el backend
2. Intentar hacer login
3. **Resultado esperado:** Error amigable en el frontend

#### Test 19: Token corrupto
1. Hacer login
2. Modificar manualmente la cookie `refresh_token` en DevTools
3. Intentar hacer una petición
4. **Resultado esperado:** Logout automático y redirección a login

---

## 🔧 Herramientas de Prueba

### Postman / Thunder Client

#### Probar Login:
```http
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Probar Refresh:
```http
POST http://localhost:3001/auth/refresh
Cookie: refresh_token=<token_from_login>
```

#### Probar Logout:
```http
POST http://localhost:3001/auth/logout
Authorization: Bearer <access_token>
```

---

## 📊 Resultados Esperados

| Test | Estado | Notas |
|------|--------|-------|
| Test 1: Registro exitoso | ✅ | |
| Test 2: Email duplicado | ✅ | |
| Test 3: Login exitoso | ✅ | |
| Test 4: Credenciales incorrectas | ✅ | |
| Test 5: Renovación automática | ✅ | |
| Test 6: Cookie configurada | ✅ | |
| Test 7: Logout exitoso | ✅ | |
| Test 8: Token invalidado | ✅ | |
| Test 9: Ruta protegida | ✅ | |
| Test 10: Ruta admin sin permisos | ✅ | |
| Test 11: Ruta admin con permisos | ✅ | |
| Test 12: Token no en localStorage | ✅ | |
| Test 13: Cookie httpOnly | ✅ | |
| Test 14: CORS | ✅ | |
| Test 15: Persistencia recarga | ✅ | |
| Test 16: Persistencia pestaña | ✅ | |
| Test 17: Expiración 7 días | ✅ | |
| Test 18: Backend caído | ✅ | |
| Test 19: Token corrupto | ✅ | |

---

## 🎯 Comandos Útiles

### Ver logs del backend:
```bash
cd app/api
npm run start:dev
```

### Ver cookies en Chrome DevTools:
1. F12 > Application > Cookies > http://localhost:3000

### Ver Network requests:
1. F12 > Network > Filter: "auth"

### Limpiar cookies:
```javascript
// En la consola del navegador
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
```

### Verificar base de datos:
```bash
docker exec -it postgres psql -U dev -d ecommerce
SELECT id, email, roles FROM users;
```
