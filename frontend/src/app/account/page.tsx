import { AccountClient } from "@/components/AccountClient";

export const metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-4xl text-forest">Your account</h1>
      <p className="mt-2 max-w-xl text-muted">
        Optional — you can check out as a guest. Accounts unlock saved details later.
      </p>
      <AccountClient />
    </div>
  );
}
