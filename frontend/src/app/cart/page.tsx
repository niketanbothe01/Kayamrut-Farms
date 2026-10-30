import Link from "next/link";

export const metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-4xl text-forest">Your cart</h1>
      <div className="surface-card mt-8 max-w-xl p-8">
        <p className="text-muted">
          Your cart is empty for now. Browse the shop and add products — live cart
          state arrives with backend integration.
        </p>
        <Link href="/shop" className="btn btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
