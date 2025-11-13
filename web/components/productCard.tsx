import Link from "next/link";
import type { Product } from "../lib/types";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="rounded-xl border p-3">
      <Link href={`/product/${p.slug}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.imageUrl || "/placeholder.png"}
          alt={p.name}
          className="h-48 w-full object-cover rounded-md"
        />
        <h3 className="mt-3 font-medium">{p.name}</h3>
        <p className="text-sm text-neutral-600">
          ${p.price.toLocaleString()}
        </p>
      </Link>
    </article>
  );
}
