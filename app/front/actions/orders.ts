"use server";

import { Order } from "@/resources/types";

const READ_API_URL = "http://localhost:8080/orders";
const WRITE_API_URL = "http://localhost:8081/orders";

export async function createOrder(order: Order) {
  try {
    const response = await fetch(`${WRITE_API_URL}/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create order: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getOrder(orderId: number): Promise<Order> {
  const res = await fetch(`${READ_API_URL}/${orderId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return res.json();
}

export async function getAllOrders(): Promise<Order[]> {
  const res = await fetch(`${READ_API_URL}/orders`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return res.json();
}

export async function prepareOrder(id: number): Promise<Order> {
  const response = await fetch(`${WRITE_API_URL}/${id}/prepare`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to prepare order");
  }

  return response.json();
}

export async function readyOrder(id: number): Promise<Order> {
  const response = await fetch(`${WRITE_API_URL}/${id}/ready`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to mark order as ready");
  }

  return response.json();
}

export async function pickUpOrder(id: number): Promise<Order> {
  const response = await fetch(`${WRITE_API_URL}/${id}/pickup`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to pick up order");
  }

  return response.json();
}

export async function cancelOrder(id: number): Promise<Order> {
  const response = await fetch(`${WRITE_API_URL}/${id}/cancel`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to cancel order");
  }

  return response.json();
}
export async function getCurrentCustomerOrder(
  customerId: number
): Promise<Order> {
  const response = await fetch(
    `${READ_API_URL}/${customerId}/current`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch current order");
  }

  return response.json();
}