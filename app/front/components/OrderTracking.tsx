"use client";

import { useEffect, useState } from "react";
import { getOrder } from "@/actions/orders";
import { Order, OrderStatus } from "@/resources/types";
import StatusBadge from "./StatusBadge";

type Props = {
    order: Order;
};

type OrderEvent = {
    eventType: string;
    orderId: number;
    customerId: number;
};

const steps: OrderStatus[] = ["PLACED", "PREPARING", "READY", "PICKED_UP"];

export default function OrderTracking({ order }: Props) {
    const [currentOrder, setCurrentOrder] = useState<Order>(order);
    const [connected, setConnected] = useState(false);
    const item = currentOrder.item;
    const quantity = currentOrder.quantity ?? 1;
    const unitPrice = item?.price ?? 0;
    const total = unitPrice * quantity;

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:8080/sse/customer/2");

        eventSource.onopen = () => {
            setConnected(true);
            console.log("Customer SSE connected");
        };

        eventSource.onmessage = async (event) => {
            const orderEvent: OrderEvent = JSON.parse(event.data);

            console.log("Customer received event:", orderEvent);

            if (orderEvent.orderId !== currentOrder.id) {
                return;
            }

            try {
                const updatedOrder = await getOrder(orderEvent.orderId);
                setCurrentOrder(updatedOrder);
            } catch (error) {
                console.error("Failed to fetch updated order:", error);
            }
        };

        eventSource.onerror = (error) => {
            console.error("Customer SSE error:", error);
            setConnected(false);
        };

        return () => {
            eventSource.close();
            setConnected(false);
        };
    }, [currentOrder.id]);

    const currentStepIndex = steps.indexOf(currentOrder.status);

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-950">
            <section className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-green-700">
                            Order tracking
                        </p>

                        <h1 className="mt-1 text-3xl font-bold">
                            Order #{currentOrder.id}
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Live status: {connected ? "Connected" : "Disconnected"}
                        </p>
                    </div>

                    <StatusBadge status={currentOrder.status} />
                </div>
                <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Your order
                    </p>

                    <div className="mt-3 flex gap-4">
                        {item?.img && (
                            <img
                                src={item.img}
                                alt={item.name}
                                className="h-20 w-20 rounded-xl object-cover"
                            />
                        )}

                        <div className="flex-1">
                            <p className="font-semibold text-gray-950">
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
                </div>
                <div className="mt-8 space-y-4">
                    {steps.map((step, index) => {
                        const isDone = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step} className="flex items-center gap-4">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${isDone
                                        ? "bg-green-700 text-white"
                                        : "bg-gray-100 text-gray-400"
                                        }`}
                                >
                                    {index + 1}
                                </div>

                                <div>
                                    <p
                                        className={`font-semibold ${isCurrent ? "text-gray-950" : "text-gray-500"
                                            }`}
                                    >
                                        {step}
                                    </p>

                                    {isCurrent && (
                                        <p className="text-sm text-gray-400">Current status</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {currentOrder.status === "CANCELED" && (
                    <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
                        This order was canceled.
                    </div>
                )}
            </section>
        </main>
    );
}