import { CartOrder, MenuItem, User } from "@/resources/types";
import { useContext } from "react";
import { NewOrderContext } from "./NewOrder";

type Props = {
  item: MenuItem;
};

const demoUser: Pick<User, "id"> = {
  id: 2,
};

export default function MenuItemCard({ item }: Props) {
  const setItems = useContext(NewOrderContext)?.setItems;

  const addItem = () => {
    const now = new Date();

    const newOrder: CartOrder = {
      customer: demoUser,
      item,
      quantity: 1,
      status: "PLACED",
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().split(" ")[0],
    };

    setItems?.((prev: CartOrder[]) => {
      const existingOrder = prev.find((order) => order.item.id === item.id);

      if (!existingOrder) {
        return [...prev, newOrder];
      }

      return prev.map((order) =>
        order.item.id === item.id
          ? { ...order, quantity: order.quantity + 1 }
          : order
      );
    });
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {item.discount > 0 && (
        <div className="absolute left-2 top-2 z-10 rounded-xl bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
          -{item.discount}%
        </div>
      )}

      <div className="flex h-full">
        <div className="relative h-44 w-40 shrink-0 overflow-hidden bg-gray-100">
          <img
            src={item.img}
            alt={item.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <h3 className="text-lg font-bold text-gray-950">
              {item.name}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
              {item.description}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            {item.discount > 0 ? (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-950">
                  {(
                    item.price *
                    (1 - item.discount / 100)
                  ).toFixed(2)} €
                </span>

                <span className="text-sm text-gray-400 line-through">
                  {item.price.toFixed(2)} €
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-950">
                {item.price.toFixed(2)} €
              </span>
            )}

            <button
              className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}