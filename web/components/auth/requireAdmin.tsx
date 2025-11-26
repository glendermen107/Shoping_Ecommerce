"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./authContext"; // <- OJO: ahora sí viene del contexto

type Props = {
  children: ReactNode;
};

export default function RequireAdmin({ children }: Props) {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // si no está autenticado, lo mando a login
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    // si está logueado pero no es admin, lo mando a home
    if (!isAdmin) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Verificando permisos...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // ya está redirigiendo
  }

  return <>{children}</>;
}
