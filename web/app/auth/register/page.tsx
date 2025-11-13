// web/app/auth/register/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Aquí después llamas al backend para registrar usuario
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Registro simulado ✅ (aquí iría la lógica real)");
    }, 800);
  };

  return (
    <section className="max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            name="name"
            required
            className="w-full rounded-md border bg-black px-3 py-2"
            placeholder="Sebastián Herrera"
          />
        </div>

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
          className="w-full rounded-md border px-4 py-2 bg_white text-black disabled:opacity-60 bg-white"
        >
          {isSubmitting ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>

      <p className="text-sm text-neutral-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="underline">
          Ingresar
        </Link>
      </p>
    </section>
  );
}
