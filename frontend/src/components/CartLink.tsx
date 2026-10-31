"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartLink() {
  const { count, ready } = useCart();

  return (
    <Link href="/cart" className="btn btn-forest !min-h-10 !px-4 text-sm">
      Cart{ready && count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
