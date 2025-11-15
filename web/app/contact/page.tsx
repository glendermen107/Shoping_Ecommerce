// web/app/contact/page.tsx
import Link from "next/link";

export default function ContactPage() {
  return (
    <section className="space-y-8 max-w-2xl">
      <header>
        <h1 className="text-2xl font-semibold">Contacto</h1>
        <p className="text-neutral-300">
          Si tienes dudas, quieres cotizar o hacer un pedido grande, déjanos tu
          mensaje o contáctanos directamente.
        </p>
      </header>

      {/* Datos directos de contacto */}
      <div className="space-y-3 text-sm">
        <p>
          <span className="font-medium">Ubicación: </span>
          Pudahuel, sector Laguna Azul con La Estrella.
        </p>
        <p>
          <span className="font-medium">WhatsApp: </span>
          {/* Reemplaza el # por tu link real */}
          <Link
            href="#"
            className="underline"
          >
            Escribir por WhatsApp
          </Link>
        </p>
        <p>
          <span className="font-medium">Correo: </span>
          {/* Reemplázalo por el correo definitivo */}
          <a href="mailto:contacto@tulimpieza.cl" className="underline">
            contacto@tulimpieza.cl
          </a>
        </p>
      </div>

      {/* Formulario básico (por ahora sin backend) */}
      <form className="space-y-4 rounded-xl border border-neutral-800 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1 text-sm">
            <label className="block text-neutral-300" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              className="w-full rounded-md border border-neutral-700 bg-transparent px-2 py-1 text-sm outline-none focus:border-neutral-400"
              placeholder="Tu nombre"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label className="block text-neutral-300" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-md border border-neutral-700 bg-transparent px-2 py-1 text-sm outline-none focus:border-neutral-400"
              placeholder="tunombre@correo.cl"
            />
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <label className="block text-neutral-300" htmlFor="message">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full rounded-md border border-neutral-700 bg-transparent px-2 py-1 text-sm outline-none focus:border-neutral-400"
            placeholder="Cuéntanos qué productos necesitas, cantidades, comuna, etc."
          />
        </div>

        <button
          type="submit"
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-white hover:text-black transition"
        >
          Enviar mensaje
        </button>
      </form>

      <p className="text-xs text-neutral-500">
        Más adelante podemos conectar este formulario con un backend o enviar
        directamente al correo del administrador.
      </p>
    </section>
  );
}
