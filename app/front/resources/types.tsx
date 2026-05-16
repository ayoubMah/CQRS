export type UserRole = "CUSTOMER" | "WORKER" | "DELIVERER";

export type OrderStatus =
  | "PLACED"
  | "PREPARING"
  | "READY"
  | "PICKED_UP"
  | "CANCELED";

export type User = {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  age?: number;
  address?: string;
  role?: UserRole;
};

export type MenuItem = {
  id?: number;
  name: string;
  description: string;
  img: string;
  price: number;
  discount: number;
};

export type Order = {
  id?: number;
  customer: Pick<User, "id">;
  item: MenuItem;
  quantity: number;
  status: OrderStatus;
  date: string;
  time: string;
};

export type CartOrder = {
  id?: number;
  customer: Pick<User, "id">;
  item: MenuItem;
  quantity: number;
  status: OrderStatus;
  date: string;
  time: string;
};

export type Delivery = {
  id?: number;
  order: Order;
  deliverer: string;
  address: string;
};