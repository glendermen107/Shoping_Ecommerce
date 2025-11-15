// web/app/admin/products/page.tsx
export default function AdminProductsPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Productos</h2>
      <p className="text-sm text-neutral-300">
        Aquí más adelante conectaremos la tabla de productos con la API de
        NestJS para crear, editar y eliminar.
      </p>

      <div className="rounded-xl border border-neutral-800 p-4 text-sm text-neutral-400">
        <p>
          • Listado de productos (nombre, categoría, precio, stock, estado).
        </p>
        <p>• Botón para agregar producto nuevo.</p>
        <p>• Botón para editar y desactivar productos existentes.</p>
      </div>
    </section>
  );
}
