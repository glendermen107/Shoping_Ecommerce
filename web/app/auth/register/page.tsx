"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/auth/authContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const ok = await register(name, email, password);
    setIsSubmitting(false);

    if (!ok) {
      setError("El correo ya está registrado.");
      return;
    }

    router.push("/auth/login");
  };

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 rounded-3xl border border-border bg-card px-6 py-8 shadow-sm">
      {/* Encabezado */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Crear cuenta
        </h1>
        <p className="text-base text-muted-foreground">
          Regístrate para seguir tus pedidos y recibir ofertas.
        </p>
      </header>

      {/* Error */}
      {error && (
        <p className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4 text-base">
        {/* Nombre */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Nombre completo
          </label>
          <input
            required
            className="
              w-full rounded-2xl border border-border bg-white
              px-3 py-2.5 text-base text-foreground
              placeholder:text-muted-foreground
              outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
            "
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Pedrito Pascal"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            className="
              w-full rounded-2xl border border-border bg-white
              px-3 py-2.5 text-base text-foreground
              placeholder:text-muted-foreground
              outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.cl"
          />
        </div>

        {/* Contraseña */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            Contraseña
          </label>
          <input
            type="password"
            required
            minLength={6}
            className="
              w-full rounded-2xl border border-border bg-white
              px-3 py-2.5 text-base text-foreground
              placeholder:text-muted-foreground
              outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            mt-2 w-full rounded-2xl bg-emerald-600 py-2.5
            text-base font-semibold text-white hover:bg-emerald-500
            disabled:cursor-not-allowed disabled:opacity-70
          "
        >
          {isSubmitting ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>

      {/* Enlace login */}
      <p className="text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Ingresar
        </Link>
      </p>
    </section>
  );
}
