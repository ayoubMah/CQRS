"use client";

import { useContext } from "react";
import { NewOrderContext } from "./NewOrder";
import { createOrder } from "@/actions/orders";
import { Order } from "@/resources/types";

export default function OrderSummary() {
  const context = useContext(NewOrderContext);

  if (!context) {
    throw new Error("OrderSummary must be used inside NewOrder");
  }

  const { items, setItems } = context;

  const subtotal = items.reduce((total, order) => {
    const price = order.item.price;
    const discount = order.item.discount ?? 0;
    const finalPrice = price * (1 - discount / 100);

    return total + finalPrice * order.quantity;
  }, 0);

  const delivery = items.length > 0 ? 3.5 : 0;
  const total = subtotal + delivery;

  const removeItem = (itemId?: number) => {
    setItems((prev) => prev.filter((order) => order.item.id !== itemId));
  };

  const placeOrder = async () => {
    try {
      for (const cartOrder of items) {
        const order: Order = {
          customer: {
            id: cartOrder.customer.id,
          },
          item: {
            id: cartOrder.item.id,
          },
          quantity: cartOrder.quantity,
          status: cartOrder.status,
          date: cartOrder.date,
          time: cartOrder.time,
        };

        console.log(order);
        await createOrder(order);
      }

      alert("Order placed!");
      setItems([]);
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    }
  };

  return (
    <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <div>
        <p className="text-sm font-medium text-gray-400">Current cart</p>
        <h2 className="mt-1 text-xl font-bold text-gray-950">
          Order Summary
        </h2>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((order) => {
          const price = order.item.price;
          const discount = order.item.discount ?? 0;
          const finalPrice = price * (1 - discount / 100);

          return (
            <div
              key={order.item.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-950">
                  {order.item.name}
                </p>

                <p className="text-xs text-gray-500">
                  Qty {order.quantity} × {finalPrice.toFixed(2)} €
                </p>

                {discount > 0 && (
                  <p className="text-xs text-gray-500">
                    Original price: {price.toFixed(2)} € / -{discount}%
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-950">
                  {(order.quantity * finalPrice).toFixed(2)} €
                </span>

                <button
                  onClick={() => removeItem(order.item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-semibold text-gray-950">
            {subtotal.toFixed(2)} €
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Delivery</span>
          <span className="font-semibold text-gray-950">
            {delivery.toFixed(2)} €
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 text-base font-bold">
          <span>Total</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>

      <button
        disabled={items.length === 0}
        className="mt-6 w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        onClick={placeOrder}
      >
        Place Order
      </button>
    </aside>
  );
}