"use client";

import { BrandSplash } from "@/components/BrandSplash";
import { CartProvider } from "@/lib/cart";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <BrandSplash />
      {children}
    </CartProvider>
  );
}
