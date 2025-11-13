import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between py-4">
      <Link href="/" className="text-xl font-semibold">
        MiTienda
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/catalog">Catálogo</Link>
        <Link href="/cart">Carrito</Link>
        <Link href="/auth/login">Ingresar</Link>
      </nav>
    </header>
  );
}
