export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-neutral-200 py-6 text-sm text-neutral-600">
      <div className="mx-auto max-w-7xl px-0 md:px-2 grid gap-4 md:grid-cols-3">
        {/* Columna 1: marca */}
        <div className="space-y-1">
          <p className="font-semibold">MiTienda · Productos de limpieza</p>
          <p className="text-xs text-neutral-500">
            Venta y distribución de productos de limpieza para hogar y empresas.
          </p>
          <p className="text-xs text-neutral-500">
            &copy; {year} MiTienda — Todos los derechos reservados.
          </p>
        </div>

        {/* Columna 2: info de atención */}
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-neutral-700">Atención y despacho</p>
          <p>Ubicación: Pudahuel, sector Laguna Azul con La Estrella.</p>
          <p>Días de trabajo: lunes a domingo.</p>
          <p>Despacho en días hábiles y retiro en tienda (hasta sábado).</p>
          <p>Expansión gradual a distintas comunas.</p>
        </div>

        {/* Columna 3: contacto */}
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-neutral-700">Contacto</p>
          <p>
            WhatsApp:{" "}
            <span className="underline">
              +56 9 0000 0000
            </span>{" "}
            {/* reemplazar por el real */}
          </p>
          <p>
            Correo:{" "}
            <a href="mailto:contacto@tulimpieza.cl" className="underline">
              contacto@tulimpieza.cl
            </a>
          </p>
          <p className="text-neutral-500">
            Facturación disponible para personas naturales y empresas.
          </p>
        </div>
      </div>
    </footer>
  );
}
