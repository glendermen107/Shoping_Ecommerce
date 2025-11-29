# Flujo de Autenticación JWT en NestJS

## Fecha: 29 de Noviembre, 2025

## Entendiendo el Flujo Completo

### 1. Generación del Token (Login)

**Archivo:** `auth.service.ts`

```typescript
private async getTokens(userId: number, email: string, roles: Role[]) {
  const jwtPayload = { sub: userId, email, roles }; // ← Payload con 'sub'
  
  const accessToken = await this.jwtService.signAsync(jwtPayload, {
    secret: this.configService.get<string>('JWT_SECRET'),
  });
  
  return { access_token: accessToken, ... };
}
```

**Token JWT generado:**
```json
{
  "sub": 1,
  "email": "test@example.com",
  "roles": ["user"],
  "iat": 1764379010,
  "exp": 1764379910
}
```

### 2. Validación del Token (Endpoints Protegidos)

Cuando un request llega a un endpoint protegido con `@UseGuards(JwtAuthGuard)`:

#### Paso 1: Passport extrae el token
```typescript
// jwt.strategy.ts - configuración
super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ← Extrae del header
  secretOrKey: secret,
});
```

#### Paso 2: Passport decodifica y valida el token
- Verifica la firma con `JWT_SECRET`
- Verifica que no haya expirado
- Extrae el payload

#### Paso 3: JwtStrategy.validate() se ejecuta
```typescript
// jwt.strategy.ts
async validate(payload: JwtPayload): Promise<User> {
  const { sub } = payload; // ← Extrae 'sub' del payload JWT
  const user = await this.userRepository.findOneBy({ id: sub }); // ← Busca en DB
  
  if (!user) {
    throw new UnauthorizedException('Token not valid');
  }
  
  return user; // ← Retorna el objeto User completo de la DB
}
```

**Objeto User retornado:**
```typescript
{
  id: 1,              // ← Viene de la DB
  email: "test@example.com",
  roles: ["user"],
  // ... otros campos de la entidad User
}
```

#### Paso 4: Passport adjunta el User a req.user
```typescript
// Passport automáticamente hace:
req.user = user; // ← El objeto User completo de la DB
```

### 3. Uso en el Controlador

**Archivo:** `auth.controller.ts`

```typescript
@UseGuards(JwtAuthGuard)
@Post('logout')
async logout(@Req() req: Request) {
  const user = req.user as any; // ← Objeto User de la DB
  
  // ✅ CORRECTO: Acceder a user.id
  const userId = user.id;
  
  // ❌ INCORRECTO: Acceder a user['sub']
  // const userId = user['sub']; // ← Esto no existe en el objeto User
  
  await this.authService.logout(userId);
  return { message: 'Logout exitoso' };
}
```

## Diagrama del Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. GENERACIÓN DEL TOKEN (Login)                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  auth.service.ts                                                │
│  ┌──────────────────────────────────────┐                      │
│  │ getTokens(userId, email, roles)      │                      │
│  │                                       │                      │
│  │ payload = {                           │                      │
│  │   sub: userId,    ← ID del usuario   │                      │
│  │   email,                              │                      │
│  │   roles                               │                      │
│  │ }                                     │                      │
│  │                                       │                      │
│  │ token = sign(payload, JWT_SECRET)    │                      │
│  └──────────────────────────────────────┘                      │
│                    │                                             │
│                    ▼                                             │
│         Token JWT firmado                                       │
│         eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 2. VALIDACIÓN DEL TOKEN (Endpoint Protegido)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Request con header:                                            │
│  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
│                    │                                             │
│                    ▼                                             │
│  ┌──────────────────────────────────────┐                      │
│  │ JwtAuthGuard                          │                      │
│  │ (usa JwtStrategy)                     │                      │
│  └──────────────────────────────────────┘                      │
│                    │                                             │
│                    ▼                                             │
│  ┌──────────────────────────────────────┐                      │
│  │ Passport extrae y decodifica token   │                      │
│  │                                       │                      │
│  │ payload = {                           │                      │
│  │   sub: 1,                             │                      │
│  │   email: "test@example.com",          │                      │
│  │   roles: ["user"]                     │                      │
│  │ }                                     │                      │
│  └──────────────────────────────────────┘                      │
│                    │                                             │
│                    ▼                                             │
│  ┌──────────────────────────────────────┐                      │
│  │ jwt.strategy.ts                       │                      │
│  │ validate(payload)                     │                      │
│  │                                       │                      │
│  │ const { sub } = payload;              │                      │
│  │ user = findOneBy({ id: sub });        │                      │
│  │                                       │                      │
│  │ return user; ← Objeto User de DB     │                      │
│  └──────────────────────────────────────┘                      │
│                    │                                             │
│                    ▼                                             │
│  ┌──────────────────────────────────────┐                      │
│  │ Passport adjunta a req.user           │                      │
│  │                                       │                      │
│  │ req.user = {                          │                      │
│  │   id: 1,        ← De la DB           │                      │
│  │   email: "test@example.com",          │                      │
│  │   roles: ["user"],                    │                      │
│  │   ...otros campos                     │                      │
│  │ }                                     │                      │
│  └──────────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 3. USO EN EL CONTROLADOR                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  auth.controller.ts                                             │
│  ┌──────────────────────────────────────┐                      │
│  │ @UseGuards(JwtAuthGuard)              │                      │
│  │ logout(@Req() req: Request)           │                      │
│  │                                       │                      │
│  │ const user = req.user;                │                      │
│  │ // user = { id: 1, email: ..., ... }  │                      │
│  │                                       │                      │
│  │ const userId = user.id; ✅ CORRECTO  │                      │
│  │ // userId = 1                         │                      │
│  │                                       │                      │
│  │ await authService.logout(userId);     │                      │
│  └──────────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

## Resumen de la Confusión

### El Problema Original

```typescript
// ❌ INCORRECTO
const userId = req.user?.['sub']; // undefined!
```

**Por qué falla:**
- El payload JWT tiene `sub`
- Pero `req.user` es el objeto User de la DB, que tiene `id`
- `req.user['sub']` no existe, por eso retorna `undefined`
- El código lanza "Usuario no autenticado"

### La Solución

```typescript
// ✅ CORRECTO
const user = req.user as any;
const userId = user.id; // Funciona!
```

**Por qué funciona:**
- `JwtStrategy.validate()` retorna el objeto User completo
- Passport adjunta ese objeto a `req.user`
- El objeto User tiene `id`, no `sub`

## Lecciones Aprendidas

1. **Payload JWT ≠ req.user**
   - Payload JWT: `{ sub, email, roles }` (lo que firmamos)
   - req.user: `{ id, email, roles, ... }` (lo que retorna validate())

2. **JwtStrategy.validate() es el puente**
   - Recibe el payload JWT (con `sub`)
   - Busca el usuario en la DB
   - Retorna el objeto User completo (con `id`)

3. **En el controlador, usa req.user.id**
   - No uses `req.user['sub']`
   - Usa `req.user.id` o `(req.user as User).id`

## Referencias

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport JWT Strategy](http://www.passportjs.org/packages/passport-jwt/)
- [JWT Standard (RFC 7519)](https://tools.ietf.org/html/rfc7519)
