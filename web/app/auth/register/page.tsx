"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Validar longitud mínima
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password);
      setSuccess(true);

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "El correo ya está registrado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <section className="mx-auto max-w-sm space-y-4">
        <div className="rounded border border-emerald-500 bg-emerald-950/40 px-4 py-3 text-center">
          <p className="text-sm text-emerald-200 font-semibold mb-2">
            ✓ Cuenta creada exitosamente
          </p>
          <p className="text-xs text-emerald-300">
            Redirigiendo al inicio de sesión...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-semibold">Crear cuenta</h1>
      <p className="text-sm text-neutral-400">
        Regístrate para seguir tus pedidos y recibir ofertas.
      </p>

      {error && (
        <p className="rounded border border-red-500 bg-red-950/40 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="mb-1 block text-xs text-neutral-400">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            className="w-full rounded border border-neutral-700 px-3 py-2 outline-none focus:border-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.cl"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-neutral-400">
            Contraseña
          </label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full rounded border border-neutral-700 px-3 py-2 outline-none focus:border-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-neutral-400">
            Confirmar contraseña
          </label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full rounded border border-neutral-700 px-3 py-2 outline-none focus:border-emerald-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>

      <p className="text-sm text-neutral-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-emerald-400 underline">
          Ingresar
        </Link>
      </p>
    </section>
  );
}
