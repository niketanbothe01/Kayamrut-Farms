import { CartClient } from "@/components/CartClient";

export const metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-4xl text-forest">Your cart</h1>
      <CartClient />
    </div>
  );
}
