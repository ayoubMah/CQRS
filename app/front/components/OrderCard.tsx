import { Order } from "@/resources/types";
import StatusBadge from "./StatusBadge";

type Props = {
  order: Order;
  actions?: React.ReactNode;
};

export default function OrderCard({ order, actions }: Props) {
  const item = order.item;

  const unitPrice = item?.price ?? 0;
  const quantity = order.quantity ?? 1;
  const total = unitPrice * quantity;

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-950">
            Order #{order.id}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Customer #{order.customer?.id} · {order.date} at {order.time}
          </p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4 flex gap-4 rounded-xl bg-gray-50 p-4">
        {item?.img && (
          <img
            src={item.img}
            alt={item.name}
            className="h-20 w-20 rounded-xl object-cover"
          />
        )}

        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Menu item
          </p>

          <p className="mt-1 font-semibold text-gray-950">
            {item?.name ?? `Item #${item?.id}`}
          </p>

          {item?.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {item.description}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Quantity:{" "}
              <span className="font-medium text-gray-900">{quantity}</span>
            </span>

            <span className="font-semibold text-gray-950">
              {total.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end">
        {actions}
      </div>
    </article>
  );
}