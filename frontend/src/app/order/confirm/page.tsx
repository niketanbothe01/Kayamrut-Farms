import { Suspense } from "react";
import { OrderConfirmClient } from "@/components/OrderConfirmClient";

export const metadata = {
  title: "Order confirmed",
};

export default function OrderConfirmPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-4xl text-forest">Thank you</h1>
      <Suspense fallback={<div className="mt-8 h-48 animate-pulse rounded-2xl bg-cream-strong" />}>
        <OrderConfirmClient />
      </Suspense>
    </div>
  );
}
