# 🔐 Integración de Refresh Tokens en Frontend Next.js

## 📋 Resumen

Esta guía explica cómo integrar el sistema de refresh tokens del backend NestJS en tu aplicación Next.js con App Router.

## ✅ Backend Completado

El backend ya tiene implementado:
- ✅ Generación de access tokens (15 minutos)
- ✅ Generación de refresh tokens (7 días)
- ✅ Refresh token almacenado en cookie httpOnly
- ✅ Endpoint `POST /auth/login`
- ✅ Endpoint `POST /auth/refresh`
- ✅ Endpoint `POST /auth/logout`
- ✅ Guards de protección (JWT y RefreshToken)

## 🎯 Cambios Necesarios en Frontend

### 1. Actualizar `lib/api.ts`

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Función para notificar a los suscriptores cuando el token se renueve
function onAccessTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// Función para agregar suscriptores que esperan el nuevo token
function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// Función para renovar el access token
async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Importante: envía las cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    accessToken = data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    accessToken = null;
    return null;
  }
}

// Cliente API mejorado con interceptación
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    credentials: 'include', // Siempre incluir cookies
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  };

  let response = await fetch(url, config);

  // Si recibimos 401, intentar renovar el token
  if (response.status === 401 && !endpoint.includes('/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;

      if (newToken) {
        onAccessTokenRefreshed(newToken);
        
        // Reintentar la petición original con el nuevo token
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(url, config);
      } else {
        // Si no se pudo renovar, redirigir al login
        window.location.href = '/auth/login';
        throw new Error('Session expired');
      }
    } else {
      // Si ya se está renovando, esperar a que termine
      const token = await new Promise<string>((resolve) => {
        addRefreshSubscriber((newToken: string) => {
          resolve(newToken);
        });
      });

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
      response = await fetch(url, config);
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Función para establecer el access token (llamar después del login)
export function setAccessToken(token: string) {
  accessToken = token;
}

// Función para limpiar el access token
export function clearAccessToken() {
  accessToken = null;
}

// Función para obtener el access token actual
export function getAccessToken() {
  return accessToken;
}

// API de autenticación
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiClient<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(data.access_token);
    return data;
  },

  register: async (email: string, password: string) => {
    return apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } finally {
      clearAccessToken();
    }
  },

  refresh: async () => {
    const data = await apiClient<{ access_token: string; user: any }>('/auth/refresh', {
      method: 'POST',
    });
    setAccessToken(data.access_token);
    return data;
  },
};

// API de productos
export const productsAPI = {
  getAll: () => apiClient('/products'),
  getOne: (id: number) => apiClient(`/products/${id}`),
  create: (data: any) => apiClient('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiClient(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => apiClient(`/products/${id}`, { method: 'DELETE' }),
};

// API de carrito
export const cartAPI = {
  get: () => apiClient('/cart'),
  add: (productId: number, quantity: number) => 
    apiClient('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  remove: (productId: number) => apiClient(`/cart/${productId}`, { method: 'DELETE' }),
  clear: () => apiClient('/cart', { method: 'DELETE' }),
};

// API de órdenes
export const ordersAPI = {
  create: () => apiClient('/orders', { method: 'POST' }),
  getAll: () => apiClient('/orders'),
  getOne: (id: number) => apiClient(`/orders/${id}`),
  complete: (id: number) => apiClient(`/orders/${id}/complete`, { method: 'PATCH' }),
};
```

### 2. Actualizar `components/auth/authContext.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, setAccessToken, clearAccessToken } from '@/lib/api';

interface User {
  id: number;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Intentar restaurar la sesión al cargar
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Intentar renovar el token usando la cookie httpOnly
        const data = await authAPI.refresh();
        setUser(data.user);
      } catch (error) {
        console.log('No hay sesión activa');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    setUser(data.user);
  };

  const logout = async () => {
    await authAPI.logout();
    clearAccessToken();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.roles?.includes('ADMIN') || false;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
```

### 3. Actualizar componente de Login

```typescript
// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/authContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/'); // Redirigir al home después del login
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}
```

### 4. Componente de Protección de Rutas

```typescript
// components/auth/RequireAuth.tsx
'use client';

import { useAuth } from './authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (!isAdmin) {
    return <div className="text-center p-8">No tienes permisos para acceder a esta página</div>;
  }

  return <>{children}</>;
}
```

### 5. Uso en páginas protegidas

```typescript
// app/profile/page.tsx
import { RequireAuth } from '@/components/auth/RequireAuth';

export default function ProfilePage() {
  return (
    <RequireAuth>
      <div>
        <h1>Mi Perfil</h1>
        {/* Contenido de la página */}
      </div>
    </RequireAuth>
  );
}

// app/admin/products/page.tsx
import { RequireAdmin } from '@/components/auth/RequireAuth';

export default function AdminProductsPage() {
  return (
    <RequireAdmin>
      <div>
        <h1>Administrar Productos</h1>
        {/* Contenido de la página */}
      </div>
    </RequireAdmin>
  );
}
```

## 🔒 Seguridad

### Configuración de Cookies (Backend)
```typescript
// Ya implementado en auth.controller.ts
res.cookie('refresh_token', tokens.refresh_token, {
  httpOnly: true,              // No accesible desde JavaScript
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'lax',            // Protección CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  path: '/',
});
```

### CORS (Backend)
```typescript
// Ya implementado en main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true, // Permitir cookies
});
```

## 🧪 Pruebas

### 1. Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### 2. Refresh Token
```bash
curl -X POST http://localhost:3001/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### 3. Logout
```bash
curl -X POST http://localhost:3001/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -b cookies.txt
```

## 📝 Variables de Entorno

### Backend (.env)
```env
JWT_SECRET=EsteEsUnSecretoSuperDificilDeAdivinar123
JWT_EXPIRATION_TIME=15m
JWT_REFRESH_SECRET=OtroSecretoMuyDificilDeAdivinar456
JWT_REFRESH_EXPIRATION_TIME=7d
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## ✅ Checklist de Implementación

- [x] Backend: Refresh token strategy
- [x] Backend: Refresh token guard
- [x] Backend: Endpoint /auth/refresh
- [x] Backend: Endpoint /auth/logout
- [x] Backend: Cookies httpOnly configuradas
- [x] Backend: CORS con credentials
- [ ] Frontend: Actualizar lib/api.ts
- [ ] Frontend: Actualizar AuthContext
- [ ] Frontend: Componentes RequireAuth/RequireAdmin
- [ ] Frontend: Actualizar página de login
- [ ] Frontend: Probar flujo completo

## 🚀 Próximos Pasos

1. Actualizar `lib/api.ts` con el código proporcionado
2. Actualizar `components/auth/authContext.tsx`
3. Crear componentes `RequireAuth` y `RequireAdmin`
4. Actualizar la página de login
5. Probar el flujo completo:
   - Login → Access token en memoria + Refresh token en cookie
   - Hacer peticiones protegidas
   - Esperar 15 minutos → Renovación automática
   - Logout → Limpieza de tokens

## 🐛 Troubleshooting

### Error: "Refresh token no encontrado"
- Verificar que las cookies se estén enviando (`credentials: 'include'`)
- Verificar configuración CORS en el backend

### Error: "Session expired"
- El refresh token expiró (7 días)
- Usuario debe hacer login nuevamente

### Error: CORS
- Verificar que `credentials: true` esté en el backend
- Verificar que `credentials: 'include'` esté en todas las peticiones del frontend
