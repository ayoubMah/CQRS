"use client";

import { Order } from "@/resources/types";

type Props = {
  order: Order;
  onPrepare: (id: number) => void;
  onReady: (id: number) => void;
  onPickUp: (id: number) => void;
  onCancel: (id: number) => void;
};

export default function WorkerOrderActions({
  order,
  onPrepare,
  onReady,
  onPickUp,
  onCancel,
}: Props) {
  if (order.status === "PLACED") {
    return (
      <div className="flex  gap-3">
        <button
          onClick={() => onPrepare(order.id!)}
          className="rounded-xl bg-slate-950 px-5 py-2 text-sm font-semibold text-white"
        >
          Accept
        </button>

        <button
          onClick={() => onCancel(order.id!)}
          className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (order.status === "PREPARING") {
    return (
      <button
        onClick={() => onReady(order.id!)}
        className="rounded-xl bg-green-700 px-5 py-2 text-sm font-semibold text-white"
      >
        Ready
      </button>
    );
  }

  if (order.status === "READY") {
    return (
      <button
        onClick={() => onPickUp(order.id!)}
        className="rounded-xl bg-blue-700 px-5 py-2 text-sm font-semibold text-white"
      >
        Pick up
      </button>
    );
  }

  return null;
}