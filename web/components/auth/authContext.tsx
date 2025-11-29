"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, logoutUser, checkAuth } from "../../lib/api";

export type User = {
  id: number;
  email: string;
  roles: string[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Intentar refrescar el token desde la cookie
        const isAuthenticated = await checkAuth();

        if (isAuthenticated) {
          // Si el refresh fue exitoso, cargar datos del usuario desde localStorage
          const savedUser = localStorage.getItem("authUser");
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } else {
          // Si no hay sesión válida, limpiar
          localStorage.removeItem("authUser");
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("authUser");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser(email, password);

      // Guardar datos del usuario en memoria y localStorage
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        roles: data.user.roles,
      };

      setUser(userData);
      localStorage.setItem("authUser", JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      await registerUser(email, password);
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("authUser");
    }
  };

  const isAdmin = (): boolean => {
    return user?.roles?.includes("admin") || false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
