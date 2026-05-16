"use client";

import { useEffect, useMemo, useState } from "react";
import OrderCard from "@/components/OrderCard";
import { Order, OrderStatus } from "@/resources/types";
import {
  getOrder,
  prepareOrder,
  readyOrder,
  pickUpOrder,
  cancelOrder,
} from "@/actions/orders";
import WorkerOrderActions from "./WorkerOrderActions";

type Props = {
  orders: Order[];
};

type StatusFilter = "ALL" | OrderStatus;

type OrderEvent = {
  eventType: string;
  orderId: number;
  customerId: number;
  date?: string;
  timestamp?: string;
};

const statusFilters: StatusFilter[] = [
  "ALL",
  "PLACED",
  "PREPARING",
  "READY",
  "PICKED_UP",
  "CANCELED",
];

export default function WorkerOrders({ orders }: Props) {
  const [currentOrders, setCurrentOrders] = useState<Order[]>(orders);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [connected, setConnected] = useState(false);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") {
      return currentOrders;
    }

    return currentOrders.filter((order) => order.status === statusFilter);
  }, [currentOrders, statusFilter]);

  function updateOrderInState(updatedOrder: Order) {
    setCurrentOrders((orders) =>
      orders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  }

  async function handlePrepare(id: number) {
    const updatedOrder = await prepareOrder(id);
    updateOrderInState(updatedOrder);
  }

  async function handleReady(id: number) {
    const updatedOrder = await readyOrder(id);
    updateOrderInState(updatedOrder);
  }

  async function handlePickUp(id: number) {
    const updatedOrder = await pickUpOrder(id);
    updateOrderInState(updatedOrder);
  }

  async function handleCancel(id: number) {
    const updatedOrder = await cancelOrder(id);
    updateOrderInState(updatedOrder);
  }

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/sse/workers");

    eventSource.onopen = () => {
      setConnected(true);
      console.log("Worker SSE connected");
    };

    eventSource.onmessage = async (event) => {
      const orderEvent: OrderEvent = JSON.parse(event.data);

      console.log("Worker received order event:", orderEvent);

      if (orderEvent.eventType !== "ORDER_PLACED") {
        return;
      }

      try {
        const fullOrder = await getOrder(orderEvent.orderId);

        setCurrentOrders((prev) => {
          const alreadyExists = prev.some((order) => order.id === fullOrder.id);

          if (alreadyExists) {
            return prev;
          }

          return [fullOrder, ...prev];
        });
      } catch (error) {
        console.error("Failed to fetch new order:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Worker SSE error:", error);
      setConnected(false);
    };

    return () => {
      eventSource.close();
      setConnected(false);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 text-gray-950">
      <section className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-700">
              Worker dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">Orders</h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor incoming orders and update their preparation status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-gray-400">Live status</p>
              <p className="text-sm font-bold text-gray-950">
                {connected ? "Connected" : "Disconnected"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white px-5 py-3 text-right shadow-sm">
              <p className="text-xs font-medium text-gray-400">
                Visible orders
              </p>
              <p className="text-2xl font-bold text-gray-950">
                {filteredOrders.length}
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                statusFilter === status
                  ? "bg-gray-950 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-950"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actions={
                <WorkerOrderActions
                  order={order}
                  onPrepare={handlePrepare}
                  onReady={handleReady}
                  onPickUp={handlePickUp}
                  onCancel={handleCancel}
                />
              }
            />
          ))}

          {filteredOrders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm font-medium text-gray-500">
              No orders found for this status.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}