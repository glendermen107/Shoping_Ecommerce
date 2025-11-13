// web/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Bienvenido a MiTienda</h1>
      <p className="text-neutral-300">
        Explora nuestras ofertas y novedades del catálogo.
      </p>

      <Link
        href="/catalog"
        className="inline-block rounded-lg border px-4 py-2 hover:bg-white hover:text-black transition"
      >
        Ir al catálogo
      </Link>
    </section>
  );
}
