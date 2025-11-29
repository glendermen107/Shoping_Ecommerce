# Corrección de Inconsistencia en JWT Payload

## Fecha: 29 de Noviembre, 2025

## Problema Descubierto

Durante las pruebas con Postman, se descubrió que el endpoint `/auth/logout` seguía fallando con error 401 "Usuario no autenticado", a pesar de que:
- El token JWT estaba siendo enviado correctamente en el header `Authorization: Bearer ...`
- El token era válido y no había expirado
- El usuario existía en la base de datos

## Causa Raíz

Había una **inconsistencia crítica** entre cómo se generaban los tokens JWT y cómo se validaban:

### Generación del Token (auth.service.ts)
```typescript
private async getTokens(userId: number, email: string, roles: Role[]) {
  const jwtPayload = { sub: userId, email, roles }; // ✅ Usa 'sub'
  // ...
}
```

### Validación del Token (jwt.strategy.ts)
```typescript
async validate(payload: JwtPayload): Promise<User> {
  const { id } = payload; // ❌ Busca 'id', pero el payload tiene 'sub'
  const user = await this.userRepository.findOneBy({ id });
  // ...
}
```

### Interfaz del Payload (jwt-payload.interface.ts)
```typescript
export interface JwtPayload {
  id: number; // ❌ Define 'id', pero el payload real tiene 'sub'
  email: string;
  roles: Role[];
}
```

## Solución

Se corrigió la interfaz y la estrategia para usar `sub` (subject), que es el **estándar JWT** para identificar al usuario:

### 1. Actualizar la Interfaz

**Archivo:** `app/api/src/auth/interfaces/jwt-payload.interface.ts`

```typescript
import { Role } from '../models/roles.model';

export interface JwtPayload {
  sub: number; // ✅ 'sub' es el estándar JWT para el subject (user ID)
  email: string;
  roles: Role[];
}
```

### 2. Actualizar la Estrategia

**Archivo:** `app/api/src/auth/strategies/jwt.strategy.ts`

```typescript
async validate(payload: JwtPayload): Promise<User> {
  const { sub } = payload; // ✅ Ahora usa 'sub'
  const user = await this.userRepository.findOneBy({ id: sub });

  if (!user) {
    throw new UnauthorizedException('Token not valid');
  }

  return user;
}
```

## Resultado

Después de aplicar estas correcciones:

✅ **POST /auth/logout** - Ahora funciona correctamente (200 OK)
✅ **Todos los endpoints protegidos** - Funcionan correctamente con el token JWT
✅ **Consistencia** - Generación y validación de tokens ahora son consistentes
✅ **Estándar JWT** - Uso correcto de `sub` según el estándar RFC 7519

## Pruebas Realizadas

```bash
# Resultados de Postman después de la corrección:
✅ POST /auth/register - 403 Forbidden (usuario ya existe - esperado)
✅ POST /auth/login - 200 OK
✅ POST /auth/refresh - 200 OK  
✅ POST /auth/logout - 200 OK (¡CORREGIDO!)
```

## Archivos Modificados

1. `app/api/src/auth/interfaces/jwt-payload.interface.ts`
   - Cambiado `id: number` a `sub: number`

2. `app/api/src/auth/strategies/jwt.strategy.ts`
   - Cambiado `const { id } = payload` a `const { sub } = payload`
   - Cambiado `findOneBy({ id })` a `findOneBy({ id: sub })`

## Lecciones Aprendidas

1. **Usar estándares JWT**: El campo `sub` (subject) es el estándar para identificar al usuario en JWT
2. **Consistencia es clave**: La generación y validación de tokens deben usar la misma estructura
3. **Testing revela problemas**: Este problema solo se descubrió al probar el flujo completo
4. **TypeScript ayuda**: Una interfaz correcta habría prevenido este problema desde el inicio

## Próximos Pasos

1. ✅ Reiniciar el servidor backend para aplicar los cambios
2. ✅ Probar nuevamente con Postman
3. ✅ Verificar que todos los endpoints protegidos funcionan
4. ✅ Documentar la corrección

## Referencias

- [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)
- [JWT Claims - Registered Claim Names](https://tools.ietf.org/html/rfc7519#section-4.1)
- Passport JWT Strategy Documentation
