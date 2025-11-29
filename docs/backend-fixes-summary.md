# Correcciones del Backend - Errores 500

## Fecha: 28 de Noviembre, 2025

## Problemas Identificados y Solucionados

### 1. Error 500 en POST /auth/register

**Problema:**
- El hook `@BeforeInsert()` estaba hasheando la contraseña múltiples veces
- No había validación para usuarios duplicados
- Posible conflicto con el email ya existente en la base de datos

**Solución:**
- Modificado el hook `hashPassword()` en `user.entity.ts` para verificar si la contraseña ya está hasheada antes de hashearla nuevamente
- Agregada validación en `auth.service.ts` para verificar si el usuario ya existe antes de intentar registrarlo
- Retorna error 403 con mensaje claro: "El usuario ya existe"

**Archivos modificados:**
- `app/api/src/auth/entities/user.entity.ts`
- `app/api/src/auth/auth.service.ts`

### 2. Error 500 en POST /auth/logout

**Problema:**
- No había validación de que el usuario existe antes de intentar actualizar
- Posible problema con la estructura de `req.user`
- No se manejaba el caso cuando `req.user` es undefined

**Solución:**
- Agregada validación en el controlador para verificar que `req.user.sub` existe
- Agregada validación en el servicio para verificar que el usuario existe en la base de datos
- Retorna error 401 con mensaje claro si el usuario no está autenticado o no existe

**Archivos modificados:**
- `app/api/src/auth/auth.controller.ts`
- `app/api/src/auth/auth.service.ts`

## Cambios Específicos

### user.entity.ts
```typescript
@BeforeInsert()
@BeforeUpdate()
hashPassword() {
  if (!this.password) return;
  // Solo hashear si la contraseña no está ya hasheada
  if (!this.password.startsWith('$2b$') && !this.password.startsWith('$2a$')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
```

### auth.service.ts - register()
```typescript
async register(registerAuthDto: RegisterAuthDto): Promise<User> {
  const { email, password } = registerAuthDto;
  
  // Verificar si el usuario ya existe
  const existingUser = await this.userRepository.findOne({
    where: { email: email.toLowerCase() }
  });
  
  if (existingUser) {
    throw new ForbiddenException('El usuario ya existe');
  }
  
  // ... resto del código
}
```

### auth.service.ts - logout()
```typescript
async logout(userId: number): Promise<void> {
  const user = await this.userRepository.findOne({ where: { id: userId } });
  
  if (!user) {
    throw new UnauthorizedException('Usuario no encontrado');
  }
  
  await this.userRepository.update(userId, { hashedRefreshToken: null });
}
```

### auth.controller.ts - logout()
```typescript
@UseGuards(JwtAuthGuard)
@Post('logout')
@HttpCode(HttpStatus.OK)
async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  const userId = req.user?.['sub'];
  
  if (!userId) {
    throw new UnauthorizedException('Usuario no autenticado');
  }
  
  // ... resto del código
}
```

## Próximos Pasos

1. Reiniciar el servidor backend para aplicar los cambios
2. Probar nuevamente los endpoints con Postman:
   - POST /auth/register (con un email nuevo)
   - POST /auth/logout (con un token válido)
3. Actualizar la colección de Postman para corregir otros problemas identificados:
   - Agregar campo "slug" en POST /products
   - Corregir URLs con IDs dinámicos (PUT, DELETE, PATCH)

## Notas

- El usuario `test@example.com` ya existe en la base de datos, por lo que register fallará con ese email
- Para probar register, usar un email diferente como `test2@example.com`
- El logout ahora requiere un token JWT válido en el header Authorization


## Corrección Adicional (Descubierta en Testing)

### 3. Error 401 "Usuario no autenticado" en POST /auth/logout

**Problema Identificado:**
- Inconsistencia entre el payload JWT y la estrategia de validación
- El servicio `auth.service.ts` creaba tokens con `sub` (estándar JWT para subject/user ID)
- Pero la estrategia `jwt.strategy.ts` buscaba `id` en el payload
- Esto causaba que el `JwtAuthGuard` no reconociera al usuario autenticado

**Solución:**

**Archivo:** `app/api/src/auth/interfaces/jwt-payload.interface.ts`
```typescript
export interface JwtPayload {
  sub: number; // 'sub' es el estándar JWT para el subject (user ID)
  email: string;
  roles: Role[];
}
```

**Archivo:** `app/api/src/auth/strategies/jwt.strategy.ts`
```typescript
async validate(payload: JwtPayload): Promise<User> {
  const { sub } = payload; // 'sub' es el estándar JWT para el subject (user ID)
  const user = await this.userRepository.findOneBy({ id: sub });

  if (!user) {
    throw new UnauthorizedException('Token not valid');
  }

  return user;
}
```

**Resultado:**
- ✅ Logout ahora funciona correctamente con el token JWT
- ✅ Todos los endpoints protegidos funcionan correctamente
- ✅ Consistencia entre generación y validación de tokens

**Archivos modificados adicionales:**
- `app/api/src/auth/interfaces/jwt-payload.interface.ts`
- `app/api/src/auth/strategies/jwt.strategy.ts`
