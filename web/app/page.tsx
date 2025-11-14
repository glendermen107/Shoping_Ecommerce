// web/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-10">
      {/* Hero principal */}
      <div className="grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-neutral-400">
            Pudahuel · Productos de limpieza
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">
            Todo en productos de limpieza, para hogar y empresas.
          </h1>
          <p className="text-neutral-300">
            Catálogo completo de cloro y productos de limpieza personal y del
            hogar. Despacho a distintas comunas y opción de retiro en tienda.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-white hover:text-black transition"
            >
              Ver catálogo
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-dashed px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition"
            >
              Contactar por pedidos
            </Link>
          </div>

          <ul className="mt-4 space-y-1 text-sm text-neutral-400">
            <li>• Despacho en días hábiles</li>
            <li>• Facturación a personas y empresas</li>
            <li>• Ofertas semanales y productos destacados</li>
          </ul>
        </div>

        {/* Bloque lateral para futuras promos / carrusel */}
        <div className="rounded-xl border border-neutral-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Promoción destacada</h2>
          <p className="text-sm text-neutral-300">
            Desde $50.000 en productos, el despacho es <strong>gratis</strong>.
          </p>
          <p className="text-xs text-neutral-500">
            *Promoción válida sólo en comunas seleccionadas. Ver detalles al
            confirmar el pedido.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-neutral-300">
            <div className="rounded-lg border border-neutral-800 p-3">
              <p className="font-medium">Cloro y desinfectantes</p>
              <p className="text-xs text-neutral-500">
                Variedad para uso industrial y hogar.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-800 p-3">
              <p className="font-medium">Limpieza del hogar</p>
              <p className="text-xs text-neutral-500">
                Multiuso, detergentes, desengrasantes y más.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de categorías rápidas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Explora por categoría</h2>
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          <Link
            href="/catalog?cat=cloro"
            className="rounded-lg border border-neutral-800 p-4 hover:bg-neutral-900 transition block"
          >
            <p className="font-medium">Cloro y desinfectantes</p>
            <p className="text-xs text-neutral-400">
              Fichas técnicas y hojas de seguridad disponibles.
            </p>
          </Link>
          <Link
            href="/catalog?cat=hogar"
            className="rounded-lg border border-neutral-800 p-4 hover:bg-neutral-900 transition block"
          >
            <p className="font-medium">Limpieza del hogar</p>
            <p className="text-xs text-neutral-400">
              Pisos, cocina, baño y superficies en general.
            </p>
          </Link>
          <Link
            href="/catalog?cat=personal"
            className="rounded-lg border border-neutral-800 p-4 hover:bg-neutral-900 transition block"
          >
            <p className="font-medium">Limpieza personal</p>
            <p className="text-xs text-neutral-400">
              Jabones, alcohol gel y más.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
