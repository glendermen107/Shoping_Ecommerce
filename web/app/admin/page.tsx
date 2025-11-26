export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Resumen</h1>
        <p className="text-sm text-muted-foreground">
          Visión general de ventas, clientes y actividad reciente.
        </p>
      </div>

      {/* Tarjetas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-card text-card-foreground border border-border shadow-sm px-4 py-3">
          <p className="text-xs text-muted-foreground">Ingresos totales</p>
          <p className="mt-2 text-2xl font-semibold">$1.250.000</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            +12.5% vs último mes
          </p>
        </div>

        <div className="rounded-3xl bg-card text-card-foreground border border-border shadow-sm px-4 py-3">
          <p className="text-xs text-muted-foreground">Nuevos clientes</p>
          <p className="mt-2 text-2xl font-semibold">1.234</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            -20% este período
          </p>
        </div>

        <div className="rounded-3xl bg-card text-card-foreground border border-border shadow-sm px-4 py-3">
          <p className="text-xs text-muted-foreground">Órdenes activas</p>
          <p className="mt-2 text-2xl font-semibold">45.678</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Entregas en curso
          </p>
        </div>

        <div className="rounded-3xl bg-card text-card-foreground border border-border shadow-sm px-4 py-3">
          <p className="text-xs text-muted-foreground">Tasa de crecimiento</p>
          <p className="mt-2 text-2xl font-semibold">4.5%</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Rendimiento estable
          </p>
        </div>
      </div>

      {/* Zona con “gráfico” y detalle lateral (estático por ahora) */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Gráfico fake */}
        <div className="rounded-3xl bg-card border border-border px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total visitors</p>
              <p className="text-xs text-muted-foreground">
                Últimos 7 días (mock)
              </p>
            </div>
            <div className="inline-flex rounded-full border border-border bg-background text-[11px]">
              <button className="px-3 py-1 text-muted-foreground">
                30 días
              </button>
              <button className="px-3 py-1 rounded-full bg-primary text-primary-foreground">
                7 días
              </button>
            </div>
          </div>

          {/* “gráfico” con degradados similares */}
          <div className="mt-2 h-40 rounded-2xl bg-gradient-to-br from-primary/40 via-primary/10 to-emerald-400/40 relative overflow-hidden">
            <div className="absolute inset-x-0 inset-y-1/2 border-t border-white/10" />
            {/* puedes reemplazar esto por un chart real después */}
          </div>
        </div>

        {/* Panel lateral */}
        <div className="rounded-3xl bg-card border border-border px-4 py-4 flex flex-col gap-3">
          <p className="text-sm font-medium">Top productos</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Detergente multiuso</span>
              <span className="font-medium">+320</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Desinfectante pisos</span>
              <span className="font-medium">+210</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Limpiavidrios</span>
              <span className="font-medium">+180</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
