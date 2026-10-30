import { ProductEditClient } from "@/components/ProductEditClient";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return [
    { id: "new" },
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ];
}

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;
  return <ProductEditClient id={id} />;
}
