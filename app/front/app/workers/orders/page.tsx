import { getAllOrders } from "@/actions/orders";
import WorkerOrders from "@/components/WorkerOrders";

export default async function WorkerOrdersPage() {
  const orders = await getAllOrders();
  return <WorkerOrders orders={orders} />;
}