// web/app/auth/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Aquí después llamas al backend (Nest) con fetch o axios
    setTimeout(() => {
      // Simulación de login
      setIsSubmitting(false);
      alert("Login simulado ✅ (aquí iría la lógica real)");
    }, 700);
  };

  return (
    <section className="max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold">Ingresar</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Correo electrónico</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border bg-black px-3 py-2"
            placeholder="correo@example.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-md border bg-black px-3 py-2"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md border px-4 py-2 bg-white text-black disabled:opacity-60"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="text-sm text-neutral-400">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/register" className="underline">
          Crear cuenta
        </Link>
      </p>
    </section>
  );
}
