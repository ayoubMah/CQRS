import { getCurrentCustomerOrder } from "@/actions/orders";
import OrderTracking from "@/components/OrderTracking";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerOrdersPage({ params }: Props) {
  const { id } = await params;

  const customerId = Number(id);
  console.log({ customerId });

  const order = await getCurrentCustomerOrder(customerId);

  return <OrderTracking order={order} />;
}