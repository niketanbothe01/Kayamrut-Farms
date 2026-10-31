import { CheckoutClient } from "@/components/CheckoutClient";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Checkout</p>
      <h1 className="font-display mt-2 text-4xl text-forest">Almost there</h1>
      <p className="mt-2 max-w-xl text-muted">
        Guest checkout — pay cash on delivery now. Online payments (Razorpay) can plug in next.
      </p>
      <CheckoutClient />
    </div>
  );
}
