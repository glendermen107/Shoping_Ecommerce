"use client";

import { useAuth } from "../../contexts/AuthContext";
import { RequireAuth } from "../../components/auth/requireAuth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <RequireAuth>
      <section className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Mi perfil</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Información de tu cuenta
          </p>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
          <div>
            <p className="text-xs text-neutral-400 mb-1">Correo electrónico</p>
            <p className="text-sm font-medium">{user?.email}</p>
          </div>

          <div>
            <p className="text-xs text-neutral-400 mb-1">ID de usuario</p>
            <p className="text-sm font-mono text-neutral-300">{user?.id}</p>
          </div>

          <div>
            <p className="text-xs text-neutral-400 mb-1">Roles</p>
            <div className="flex gap-2 mt-1">
              {user?.roles.map((role) => (
                <span
                  key={role}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${role === 'admin'
                      ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700'
                      : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4">
            <p className="text-sm font-medium text-emerald-300 mb-2">
              Panel de administración
            </p>
            <p className="text-xs text-emerald-400/70 mb-3">
              Tienes acceso al panel de administración
            </p>
            <button
              onClick={() => router.push('/admin')}
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Ir al panel de admin
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Cerrar sesión
          </button>
        </div>
      </section>
    </RequireAuth>
  );
}
