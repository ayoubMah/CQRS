"use server";

import { MenuItem } from "@/resources/types";


const BASE_URL = "http://localhost:8080"; // change if needed

export async function getMenu(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/items`, {
      method: "GET",
      cache: "no-store", // important for fresh data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch menu");
    }

    return res.json();
  } catch (err) {
    console.error("Error fetching menu:", err);
    return [];
  }
}