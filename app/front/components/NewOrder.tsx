'use client';

import { createContext, useState } from 'react';
import NewOrderHeader from './NewOrderHeader';
import MenuGrid from './MenuGrid';
import OrderSummary from './OrderSummary';
import { CartOrder, MenuItem, Order } from '@/resources/types';

type NewOrderContextType = {
  items: CartOrder[];
  setItems: React.Dispatch<React.SetStateAction<CartOrder[]>>;
};

export const NewOrderContext =
  createContext<NewOrderContextType | null>(null);

const NewOrder = ({ menu }: { menu: MenuItem[] }) => {
  const [items, setItems] = useState<CartOrder[]>([]);

  console.log(items)
  return (
    <NewOrderContext.Provider
      value={{
        items,
        setItems,
      }}
    >
      <section className="space-y-8">
        <NewOrderHeader />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <MenuGrid menu={menu} />
          <OrderSummary />
        </div>
      </section>
    </NewOrderContext.Provider>
  );
};

export default NewOrder;