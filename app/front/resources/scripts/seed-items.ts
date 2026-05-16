import { MenuItem } from "../types";


const API_URL = "http://localhost:8080/items/new";

const baseItems: MenuItem[] = [
  {
    name: "Classic Burger",
    description: "Beef patty, cheese, lettuce, tomato, and house sauce.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    price: 8.5,
    discount: 0,
  },
  {
    name: "Cheese Burger",
    description: "Juicy beef burger with melted cheddar and pickles.",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
    price: 9,
    discount: 0,
  },
  {
    name: "Chicken Burger",
    description: "Crispy chicken fillet with lettuce and garlic sauce.",
    img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800",
    price: 8.9,
    discount: 0,
  },
  {
    name: "Margherita Pizza",
    description: "Tomato sauce, mozzarella, basil, and olive oil.",
    img: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800",
    price: 10,
    discount: 0,
  },
  {
    name: "Pepperoni Pizza",
    description: "Mozzarella, tomato sauce, and spicy pepperoni.",
    img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800",
    price: 11.5,
    discount: 0,
  },
  {
    name: "Chicken Tacos",
    description: "Grilled chicken, fries, cheese sauce, and tortillas.",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    price: 9.5,
    discount: 0,
  },
  {
    name: "Beef Tacos",
    description: "Seasoned beef, melted cheese, fries, and spicy sauce.",
    img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800",
    price: 10.5,
    discount: 0,
  },
  {
    name: "Chicken Wrap",
    description: "Chicken strips, salad, tomatoes, and creamy sauce.",
    img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800",
    price: 7.9,
    discount: 0,
  },
  {
    name: "Caesar Salad",
    description: "Romaine lettuce, chicken, parmesan, croutons, and Caesar sauce.",
    img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800",
    price: 8,
    discount: 0,
  },
  {
    name: "Pasta Carbonara",
    description: "Creamy pasta with parmesan, turkey bacon, and black pepper.",
    img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800",
    price: 11,
    discount: 0,
  },
];

const variants = [
  { prefix: "", priceAdd: 0, discount: 0 },
  { prefix: "Spicy", priceAdd: 0.7, discount: 0 },
  { prefix: "Double", priceAdd: 2.5, discount: 0 },
  { prefix: "Special", priceAdd: 1.5, discount: 10 },
  { prefix: "XL", priceAdd: 3, discount: 5 },
  { prefix: "Premium", priceAdd: 4, discount: 0 },
  { prefix: "Chef's", priceAdd: 2, discount: 15 },
  { prefix: "Family", priceAdd: 5, discount: 10 },
  { prefix: "Loaded", priceAdd: 2.2, discount: 0 },
  { prefix: "House", priceAdd: 1, discount: 5 },
];

const items: MenuItem[] = baseItems.flatMap((item) =>
  variants.map((variant) => ({
    ...item,
    name: variant.prefix ? `${variant.prefix} ${item.name}` : item.name,
    price: Number((item.price + variant.priceAdd).toFixed(2)),
    discount: variant.discount,
  }))
);

async function seedMenu() {
  console.log(`Seeding ${items.length} menu items...`);

  for (const item of items) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      console.error(`Failed to create ${item.name}:`, await response.text());
      continue;
    }

    const created = await response.json();
    console.log(`Created: ${created.name}`);
  }

  console.log("Done.");
}

seedMenu();