import { OrderStatus } from "@/resources/types";

type Props = {
  status: OrderStatus;
};

const statusStyles: Record<OrderStatus, string> = {
  PLACED: "bg-gray-100 text-gray-700",
  PREPARING: "bg-orange-100 text-orange-700",
  READY: "bg-purple-100 text-purple-700",
  PICKED_UP: "bg-yellow-100 text-yellow-700",
  CANCELED: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}