export type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY_FOR_DELIVERY"
  | "PICKED_UP"
  | "DELIVERED";

export type Order = {
  id: string;
  customerName: string;
  address: string;
  items: string[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export const orders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Ayoub",
    address: "Paris 13",
    items: ["Classic Burger", "Coca-Cola"],
    total: 10.5,
    status: "PLACED",
    createdAt: "12:30",
  },
  {
    id: "ORD-002",
    customerName: "Mehdi",
    address: "Paris 15",
    items: ["Margherita Pizza"],
    total: 10,
    status: "READY_FOR_DELIVERY",
    createdAt: "12:45",
  },
  {
    id: "ORD-003",
    customerName: "Sara",
    address: "Paris 11",
    items: ["Chicken Tacos", "Coca-Cola"],
    total: 11,
    status: "PICKED_UP",
    createdAt: "13:00",
  },
];